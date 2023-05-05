import React from "react";
import s from "./CircularProgress.module.css";

const CircularProgress = ({ progress, dataTooltip }) => {
    const dashArray = 628; // длина окружности с радиусом 50
    const dashOffset = dashArray - (progress / 100) * dashArray;

    const getColor = () => {
        if (progress === 0) {
            return "#fff";
        } else if (progress <= 10) {
            return "#000";
        } else if (progress <= 20) {
            return "#f00";
        } else if (progress <= 30) {
            return "#f44336";
        } else if (progress <= 40) {
            return "#ff5722";
        } else if (progress <= 50) {
            return "#ff9800";
        } else if (progress <= 60) {
            return "#ffc107";
        } else if (progress <= 80) {
            return "#8bc34a";
        } else if (progress <= 100) {
            return "#4caf50";
        } else {
            return "#fff";
        }
    };

    return (
        <div data-tooltip={dataTooltip} className={s.progress + " " + s.hint}>
            <svg className={s.svgCircle} viewBox="0 0 224 224">
                <circle className={s.track} style={{ stroke: getColor() }} cx="112" cy="112" r="100" />
                <circle
                    className={s.circle}
                    cx="112"
                    cy="112"
                    r="100"
                    style={{ strokeDasharray: dashArray, strokeDashoffset: dashOffset, stroke: getColor() }}
                />
                <text className={s.text} style={{ fill: getColor()}} x="51%" y="64.6%" textAnchor="middle">
                    {progress}
                </text>
            </svg>
        </div>
    );
};

export default CircularProgress;