import { useState } from "react";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";
import DirectionsBoatOutlinedIcon from "@mui/icons-material/DirectionsBoatOutlined";
import FlightOutlinedIcon from "@mui/icons-material/FlightOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import "./truck-background.css";

const BACKGROUND_ICONS = [
  LocalShippingOutlinedIcon,
  Inventory2OutlinedIcon,
  LocalShippingOutlinedIcon,
  WarehouseOutlinedIcon,
  DirectionsBoatOutlinedIcon,
  LocalShippingOutlinedIcon,
  FlightOutlinedIcon,
  LocationOnOutlinedIcon,
  RouteOutlinedIcon,
];

const randomBetween = (min, max) => min + Math.random() * (max - min);
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const createTrucks = () => Array.from({ length: 24 }, (_, index) => {
  const x = 3 + (index % 6) * 16 + randomBetween(0, 8);
  const y = 4 + Math.floor(index / 6) * 24 + randomBetween(0, 10);
  const duration = randomBetween(42, 76);
  const style = {
    "--truck-size": `${randomBetween(28, 44)}px`,
    "--truck-opacity": randomBetween(0.16, 0.3),
    "--truck-duration": `${duration}s`,
    "--truck-delay": `${-randomBetween(0, duration)}s`,
    "--truck-facing": index % 3 === 0 ? -1 : 1,
    "--x0": `${x}vw`,
    "--y0": `${y}vh`,
    "--r0": `${randomBetween(-12, 12)}deg`,
  };

  for (let point = 1; point <= 3; point += 1) {
    style[`--x${point}`] = `${clamp(x + randomBetween(-18, 18), 2, 93)}vw`;
    style[`--y${point}`] = `${clamp(y + randomBetween(-16, 16), 2, 93)}vh`;
    style[`--r${point}`] = `${randomBetween(-18, 18)}deg`;
  }

  return style;
});

const TruckBackground = () => {
  const [trucks] = useState(createTrucks);

  return (
    <div className="truck-background" aria-hidden="true">
      {trucks.map((style, index) => {
        const Icon = BACKGROUND_ICONS[index % BACKGROUND_ICONS.length];

        return (
          <span className="truck-background__truck" key={index} style={style}>
            <Icon fontSize="inherit" focusable="false" />
          </span>
        );
      })}
    </div>
  );
};

export default TruckBackground;
