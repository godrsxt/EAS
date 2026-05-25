import * as QRCode from 'qrcode';
type QRCodeType = typeof QRCode;

export interface RemotePlayerState {
  position: { x: number; y: number; z: number };
  rotation: { yaw: number; pitch: number };
  health: number;
  isShooting: boolean;
}

export class NetworkManager {
  private peerConnection: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private isHost = false;
  private localState: RemotePlayerState = {
    position: { x: 0, y: 0, z: 0 },
    rotation: { yaw: 0, pitch: 0 },
    health: 100,
    isShooting: false,
  };
  private remoteState: RemotePlayerState = {
    position: { x: 0, y: 0, z: 0 },
    rotation: { yaw: 0, pitch: 0 },
    health: 100,
    isShooting: false,
  };
  private onRemoteStateUpdate: ((state: RemotePlayerState) => void) | null = null;
  private onConnectionEstablished: (() => void) | null = null;
  private onConnectionClosed: (() => void) | null = null;
  private syncInterval: number | null = null;

  constructor(isHost: boolean = false) {
    this.isHost = isHost;
  }

  public async createOffer(): Promise<string> {
    const iceServers = [
      { urls: ['stun:stun.l.google.com:19302'] },
      { urls: ['stun:stun1.l.google.com:19302'] },
    ];

    this.peerConnection = new RTCPeerConnection({
      iceServers,
    });

    this.dataChannel = this.peerConnection.createDataChannel('game', {
      ordered: true,
    });
    this.setupDataChannel();

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('ICE candidate:', event.candidate);
      }
    };

    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);

    const sdpString = JSON.stringify(offer.sdp);
    const compressed = btoa(sdpString);

    return compressed;
  }

  public async createAnswerFromOffer(compressedOffer: string): Promise<string> {
    const iceServers = [
      { urls: ['stun:stun.l.google.com:19302'] },
      { urls: ['stun:stun1.l.google.com:19302'] },
    ];

    this.peerConnection = new RTCPeerConnection({
      iceServers,
    });

    this.peerConnection.ondatachannel = (event) => {
      this.dataChannel = event.channel;
      this.setupDataChannel();
    };

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('ICE candidate:', event.candidate);
      }
    };

    const sdpString = atob(compressedOffer);
    const offerSDP = JSON.parse(sdpString);
    const offer = new RTCSessionDescription({
      type: 'offer',
      sdp: offerSDP,
    });

    await this.peerConnection.setRemoteDescription(offer);

    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);

    const answerString = JSON.stringify(answer.sdp);
    const compressed = btoa(answerString);

    return compressed;
  }

  public async processAnswer(compressedAnswer: string): Promise<void> {
    if (!this.peerConnection) {
      throw new Error('Peer connection not initialized');
    }

    const sdpString = atob(compressedAnswer);
    const answerSDP = JSON.parse(sdpString);
    const answer = new RTCSessionDescription({
      type: 'answer',
      sdp: answerSDP,
    });

    await this.peerConnection.setRemoteDescription(answer);
  }

  private setupDataChannel(): void {
    if (!this.dataChannel) return;

    this.dataChannel.onopen = () => {
      console.log('Data channel opened');
      this.onConnectionEstablished?.();
      this.startSyncLoop();
    };

    this.dataChannel.onclose = () => {
      console.log('Data channel closed');
      this.onConnectionClosed?.();
      this.stopSyncLoop();
    };

    this.dataChannel.onmessage = (event) => {
      try {
        const state = JSON.parse(event.data) as RemotePlayerState;
        this.remoteState = state;
        this.onRemoteStateUpdate?.(state);
      } catch (e) {
        console.error('Failed to parse message:', e);
      }
    };

    this.dataChannel.onerror = (error) => {
      console.error('Data channel error:', error);
    };
  }

  public updateLocalState(state: Partial<RemotePlayerState>): void {
    this.localState = { ...this.localState, ...state };
  }

  private startSyncLoop(): void {
    this.syncInterval = window.setInterval(() => {
      this.sendState();
    }, 16);
  }

  private stopSyncLoop(): void {
    if (this.syncInterval !== null) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  private sendState(): void {
    if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
      return;
    }

    try {
      this.dataChannel.send(JSON.stringify(this.localState));
    } catch (e) {
      console.error('Failed to send state:', e);
    }
  }

  public getRemoteState(): RemotePlayerState {
    return this.remoteState;
  }

  public onRemoteStateUpdated(callback: (state: RemotePlayerState) => void): void {
    this.onRemoteStateUpdate = callback;
  }

  public onConnected(callback: () => void): void {
    this.onConnectionEstablished = callback;
  }

  public onDisconnected(callback: () => void): void {
    this.onConnectionClosed = callback;
  }

  public async generateQRCode(text: string, canvasId: string): Promise<void> {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      throw new Error(`Canvas element with id "${canvasId}" not found`);
    }

    await QRCode.toCanvas(canvas, text, {
      errorCorrectionLevel: 'H' as const,
      quality: 0.95,
      margin: 1,
      width: 300,
    } as any);
  }

  public dispose(): void {
    this.stopSyncLoop();
    this.dataChannel?.close();
    this.peerConnection?.close();
  }
}
