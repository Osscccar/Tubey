declare global {
  namespace JSX {
    interface IntrinsicElements {
      'mux-player': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'playback-id'?: string;
        'stream-type'?: string;
        'metadata-video-title'?: string;
        'metadata-viewer-user-id'?: string;
        controls?: string;
        autoplay?: string;
        muted?: boolean;
        style?: React.CSSProperties;
        onError?: () => void;
      };
    }
  }
}

export {};