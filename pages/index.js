import head from "next/head";
import Layor from "../components/Layor";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  //states

  const [isplaying, setIplaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedAudio, setSelectedAudio] = useState([]);

  console.log(selectedAudio);

  // ref

  const audioplayer = useRef();
  const progressBar = useRef();
  const animated = useRef();
  const findAudio = useRef();

  useEffect(() => {
    const seconds = Math.floor(audioplayer?.current?.duration);
    setDuration(seconds);
    if (!seconds === undefined) {
      progressBar.current.max = seconds;
    }
  }, [audioplayer.current?.loadedmetadata, audioplayer?.current?.readyState]);

  const WhilePlaying = () => {
    progressBar.current.value = audioplayer?.current?.currentTime;
    setCurrentTime(progressBar?.current?.value);
    animated.current = requestAnimationFrame(WhilePlaying);
  };

  const togglePlayPause = () => {
    const prev = isplaying;
    setIplaying(!prev);
    if (!prev) {
      audioplayer.current.play();
      animated.current = requestAnimationFrame(WhilePlaying);
    } else {
      audioplayer.current.pause();
      cancelAnimationFrame(animated.current);
    }
  };

  const ChangeRange = () => {
    audioplayer.current.currentTime = progressBar?.current.value;
    setCurrentTime(progressBar.current.value);
  };

  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const returnMinutes = minutes < 10 ? `0${minutes}` : minutes;

    const seconds = Math.floor(secs % 60);
    const returnseconds = seconds < 10 ? `0${seconds}` : seconds;

    return `${returnMinutes}:${returnseconds} `;
  };

  const selectAudioReader = (e) => {
    const reader = new FileReader();

    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);

      reader.onload = (Event) => {
        setSelectedAudio(Event.target.result);
      };
    }
  };

  const Reselected = () => {
    if (!selectedAudio) {
      setSelectedAudio([]);
      findAudio.current = null;
    } else {
      findAudio.current.click();
    }
  };

  return (
    <Layor>
      <div className=" mx-auto absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center ">
        <div className="bg-white w-[400px] h-[400px] shadow-md flex items-center justify-center   rounded-xl ">
          <div className="flex items-center justify-between flex-col h-[200px] w-full ">
            <button
              onClick={Reselected}
              className="py-[10px] px-[20px] rounded-lg bg-blue-400  text-white active:scale-50 duration-300 ease-linear transition-all"
            >
              Select Music
            </button>
            <input
              ref={findAudio}
              hidden
              type="file"
              onChange={selectAudioReader}
            />
            {selectedAudio ? (
              <>
                {selectedAudio && (
                  <audio
                    ref={audioplayer}
                    src={selectedAudio}
                    preload="metadata"
                  ></audio>
                )}

                <div className="flex items-center">
                  <p className="mx-[5px] text-sm  text-gray-400">
                    {calculateTime(currentTime)}
                  </p>
                  <input
                    className="w-full"
                    type="range"
                    ref={progressBar}
                    onChange={ChangeRange}
                    min="0"
                    defaultValue="0"
                  />{" "}
                  <p className="mx-[5px] py-[5] text-sm  text-gray-400">
                    {duration && !isNaN(duration) && calculateTime(duration)}
                  </p>
                </div>
                <div>
                  <SkipPreviousIcon className="text-green-300 h-10 w-10 cursor-pointer" />
                  {!isplaying ? (
                    <PlayCircleFilledWhiteIcon
                      onClick={togglePlayPause}
                      disabled={selectedAudio.length === 0}
                      className="text-green-300 disabled:cursor-not-allowed disabled:text-gray-200 h-10 w-10  cursor-pointer"
                    />
                  ) : (
                    <PauseCircleFilledIcon
                      onClick={togglePlayPause}
                      disabled={!selectedAudio.length === 0}
                      className="text-green-300 h-10 w-10  cursor-pointer"
                    />
                  )}
                  <SkipNextIcon className="text-green-300 h-10 w-10  cursor-pointer" />
                </div>
              </>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </Layor>
  );
}
