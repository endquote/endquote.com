import PlayIcon from "@fortawesome/fontawesome-free/svgs/regular/play-circle.svg";
import classNames from "classnames";
import hls from "hls.js/dist/hls.light";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { BASE_HLS, DEV } from "../data/constants";
import { trackComponentEvent } from "../utils/tracking";
import css from "./Video.module.scss";

type Props = {
  hlsPath: string;
  skip?: number;
  autoPlay?: boolean;
  poster: string;
  audio?: boolean;
};

/*
Play back HLS-encoded video, which is natively supported on iOS,
and works everywhere else via the MediaSource implementation in
hls.js. The script in scripts/hls.sh can do the actual video
encoding.
*/
export const Video: FC<Props> = ({
  hlsPath,
  skip = 0,
  autoPlay = false,
  poster,
  audio = false,
}) => {
  const video = useRef<HTMLVideoElement>(null!);

  const hlsUrl = `${BASE_HLS}/${hlsPath}/playlist.m3u8`;

  // @ts-ignore
  const [hlsPlayer, setHlsPlayer] = useState<Hls>();
  const [tracked, setTracked] = useState(false);
  const [attached, setAttached] = useState(false);
  const [playing, setIsPlaying] = useState(false);

  const play = useCallback(()=>{
    if (attached) {
      // Play after a pause.
      video.current.play();
      return;
    }

    if (
      !hls.isSupported() &&
      !video.current.src &&
      video.current.canPlayType("application/vnd.apple.mpegurl")
    ) {
      // Playing for the first time on iOS
      const seek = () => {
        video.current.currentTime = skip;
        video.current.removeEventListener("playing", seek);
      };
      video.current.addEventListener("playing", seek);
      video.current.src = hlsUrl;
      video.current.play();
    } else {
      // Playing for the first time where MediaSource is supported
      setHlsPlayer(new hls({ autoStartLoad: false }));
    }

    setAttached(true);
  }, [attached, hlsUrl, skip])

  // Initialize the HLS player.
  useEffect(() => {
    if (hlsPlayer === undefined) {
      return;
    }

    hlsPlayer.attachMedia(video.current);
    hlsPlayer.on(hls.Events.MEDIA_ATTACHED, () => {
      hlsPlayer.loadSource(hlsUrl);
      hlsPlayer.on(hls.Events.MANIFEST_PARSED, () => {
        hlsPlayer.startLoad(skip);
        video.current.play();
      });
    });

    if (autoPlay) {
      play();
    }

    return function cleanup() {
      hlsPlayer.destroy();
    };
  }, [autoPlay, hlsPlayer, hlsUrl, play, skip]);

  useEffect(() => {
    if (autoPlay && !DEV) {
      play();
    }
  }, [autoPlay, play]);

  function onPlayBtnClick() {
    play();
  }

  function onVideoPlayed() {
    setIsPlaying(true);
  }

  function onVideoPaused() {
    setIsPlaying(false);
  }

  function onVideoEnded() {
    if (autoPlay) {
      return;
    }

    if (hlsPlayer) {
      // End HLS player
      setHlsPlayer(undefined);
    }

    // Return to poster frame
    video.current.load();
    setAttached(false);
  }

  useEffect(() => {
    // Track an event on the first play.
    if (!tracked && playing) {
      trackComponentEvent(__filename, "play", hlsPath);
      setTracked(true);
    }
  }, [hlsPath, playing, tracked]);

  return (
    <div
      className={classNames(
        "embed-responsive",
        "embed-responsive-16by9",
        css.rounded
      )}
    >
      <video
        muted={!audio}
        loop={autoPlay}
        playsInline={true}
        ref={video}
        controls={playing}
        poster={poster}
        onPlay={onVideoPlayed}
        onPause={onVideoPaused}
        onEnded={onVideoEnded}
      />
      <div
        className={classNames(
          css.playContainer,
          "position-absolute",
          playing ? css.playing : null
        )}
        onClick={onPlayBtnClick}
      >
        <div
          className={classNames(
            css.play,
            "position-absolute",
            "text-center",
            "w-100"
          )}
        >
          <PlayIcon width="100" height="100" style={{ fill: "white" }} />
        </div>
      </div>
    </div>
  );
};
