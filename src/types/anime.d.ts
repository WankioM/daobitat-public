declare module 'animejs' {
  interface AnimeParams {
    targets: string | Element | Element[] | NodeList | null;
    duration?: number;
    delay?: number | Function;
    endDelay?: number;
    easing?: string;
    direction?: 'normal' | 'reverse' | 'alternate';
    loop?: number | boolean;
    autoplay?: boolean;
    [key: string]: any;
  }

  interface AnimeInstance {
    play(): void;
    pause(): void;
    restart(): void;
    reverse(): void;
    seek(time: number): void;
    [key: string]: any;
  }

  interface AnimeStatic {
    (params: AnimeParams): AnimeInstance;
    stagger(value: number): number;
    random(min: number, max: number): number;
    timeline(params?: AnimeParams): AnimeInstance;
  }

  const anime: AnimeStatic;
  export = anime;
}