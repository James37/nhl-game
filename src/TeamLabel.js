import React from "react";
import { Image } from "react-bootstrap";
import "./TeamLabel.css";

const TeamLabel = ({ team }) => {
  if (!team?.player?.person) return null;

  const player = team.player;

  return (
    <div className="team-label">
      <Image
        src={`http://nhl.bamcontent.com/images/headshots/current/168x168/${team.player.person.id}.jpg`}
        alt={`${player.person.fullName} Headshot`}
        onError={(e) => {
          e.target.onerror = null; // prevent infinite loop if default image also fails
          e.target.src = `https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${team.id}.svg`; // replace with team logo
        }}
        className="player-headshot"
      />
      <div className="player-name">{player.person.fullName}</div>
    </div>
  );
};

export default TeamLabel;
