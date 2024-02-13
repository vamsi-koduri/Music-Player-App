import React, { useState, useRef, useEffect } from "react";
import "../styles/MusicPlayer.css";
import {
  FaRegHeart,
  FaHeart,
  FaForward,
  FaStepForward,
  FaStepBackward,
  FaBackward,
  FaPlay,
  FaPause,
  FaShareAlt,
} from "react-icons/fa";
import { BsDownload } from "react-icons/bs";
import { Songs } from "./Songs";

function MusicPlayer({ auto }) {
  const [isLove, setLove] = useState(false);
  const [isPlaying, setPlay] = useState(auto);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrenttime] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const audioPlayer = useRef();
  const progressBar = useRef();
  const animationRef = useRef();

  useEffect(() => {
    const seconds = Math.floor(audioPlayer.current.duration);
    setDuration(seconds);
    progressBar.current.max = seconds;
  }, [audioPlayer?.current?.loadedmetada, audioPlayer?.current?.readyState]);

  const changePlayPause = () => {
    const prevValue = isPlaying;
    setPlay(!prevValue);

    if (!prevValue) {
      audioPlayer.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioPlayer.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
  };

  const whilePlaying = () => {
    progressBar.current.value = audioPlayer.current.currentTime;
    changeCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  const calculateTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const returnMin = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(sec % 60);
    const returnSec = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnMin} : ${returnSec}`;
  };

  const changeProgress = () => {
    audioPlayer.current.currentTime = progressBar.current.value;
    changeCurrentTime();
  };

  const changeCurrentTime = () => {
    progressBar.current.style.setProperty(
      "--played-width",
      `${(progressBar.current.value / duration) * 100}%`
    );

    setCurrenttime(progressBar.current.value);
  };

  const changeSongLove = () => {
    setLove(!isLove);
  };

  const changeSong = (direction) => {
    // const prevValue = isPlaying;
    // setPlay(!prevValue);
    // if (direction === "next") {
    //   setCurrentSongIndex((prevIndex) => (prevIndex + 1) % Songs.length);
    //   audioPlayer.current.play();
    //   animationRef.current = requestAnimationFrame(whilePlaying);
    // } else if (direction === "previous") {
    //   setCurrentSongIndex(
    //     (prevIndex) => (prevIndex - 1 + Songs.length) % Songs.length
    //   );
    //   audioPlayer.current.play();
    //   animationRef.current = requestAnimationFrame(whilePlaying);
    // }

    const prevValue = isPlaying;
    setPlay(false); // Pause the player temporarily

    if (direction === "next") {
      setCurrentSongIndex((prevIndex) => (prevIndex + 1) % Songs.length);
    } else if (direction === "previous") {
      setCurrentSongIndex(
        (prevIndex) => (prevIndex - 1 + Songs.length) % Songs.length
      );
    }

    // Check if the audio element is ready
    if (audioPlayer.current.readyState >= 2) {
      // Ensure metadata is loaded
      if (audioPlayer.current.duration !== Infinity) {
        // Play the new song after a short delay to ensure consistent behavior
        setTimeout(() => {
          audioPlayer.current.play();
          setPlay(true); // Resume the player
        }, 100);
      }
    }

    // If the audio element is not ready, wait for it to load and then play
    audioPlayer.current.onloadedmetadata = () => {
      // Play the new song after a short delay to ensure consistent behavior
      setTimeout(() => {
        audioPlayer.current.play();
        setPlay(true); // Resume the player
      }, 100);
    };
  };

  return (
    <div className="musicPlayer">
      <div className="songImage">
        <img src={Songs[currentSongIndex].imgSrc} alt="" />
      </div>
      <div className="songAttributes">
        <audio
          src={Songs[currentSongIndex].song}
          preload="metadata"
          ref={audioPlayer}
        />

        <div className="top">
          <div className="left">
            <div className="loved" onClick={changeSongLove}>
              {isLove ? (
                <i>
                  <FaRegHeart />
                </i>
              ) : (
                <i>
                  <FaHeart />
                </i>
              )}
            </div>
            <i className="download">
              <BsDownload />
            </i>
          </div>

          <div className="middle">
            <div className="back" onClick={() => changeSong("previous")}>
              <i>
                <FaStepBackward />
              </i>
              <i>
                <FaBackward />
              </i>
            </div>
            <div className="playPause" onClick={changePlayPause}>
              {isPlaying ? (
                <i>
                  <FaPause />
                </i>
              ) : (
                <i>
                  <FaPlay />
                </i>
              )}
            </div>
            <div className="forward" onClick={() => changeSong("next")}>
              <i>
                <FaForward />
              </i>
              <i>
                <FaStepForward />
              </i>
            </div>
          </div>

          <div className="right">
            <i>
              <FaShareAlt />
            </i>
          </div>
        </div>

        <div className="bottom">
          <div className="currentTime">{calculateTime(currentTime)}</div>
          <input
            type="range"
            className="progressBar"
            ref={progressBar}
            defaultValue="0"
            onChange={changeProgress}
            autoPlay={auto}
          />
          <div className="duration">
            {duration && !isNaN(duration) && calculateTime(duration)
              ? duration && !isNaN(duration) && calculateTime(duration)
              : "00:00"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;
