import React from "react";
import { Table, Image, Button } from "react-bootstrap";
import TableCell from "./TableCell";
import "./PlayerComparisonTable.css";

const categoriesLabels = {
  assists: "Assists",
  goals: "Goals",
  points: "Points",
  shots: "Shots",
  powerPlayPoints: "Power Play Points",
  penaltyMinutes: "Penalty Minutes",
  blocked: "Blocked Shots",
  hits: "Hits",
  plusMinus: "Plus/Minus",
  timeOnIcePerGame: "Time on Ice per Game",
  pim: "Penalty Minutes",
};

const PlayerComparisonTable = ({ rowPlayer, colPlayer, grid, onGuess }) => {
  const handleGuess = (category, isCorrect, playerId) => {
    onGuess({
      category,
      isCorrect,
      playerId,
    });
  };

  return (
    <Table>
      <thead className="table-heading">
        <tr>
          <th className="text-center">
            <Image
              src={`http://nhl.bamcontent.com/images/headshots/current/168x168/${rowPlayer.person.id}.jpg`}
              alt={`${rowPlayer.person.fullName} Headshot`}
              className="player-headshot"
            />
            <div className="text-center">{rowPlayer.person.fullName}</div>
          </th>
          <th className="text-center">VS</th>
          <th className="text-center">
            <Image
              src={`http://nhl.bamcontent.com/images/headshots/current/168x168/${colPlayer.person.id}.jpg`}
              alt={`${colPlayer.person.fullName} Headshot`}
              className="player-headshot"
            />
            <div className="text-center">{colPlayer.person.fullName}</div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr className="text-center">
          <td>{rowPlayer.stats.games}</td>
          <td style={{ fontSize: 14 }}>Games Played</td>
          <td>{colPlayer.stats.games}</td>
        </tr>
        {grid.map((item, index) => (
          <tr key={index}>
            <TableCell
              playerId={item.playerId}
              isCorrect={item.isCorrect}
              category={item.category}
              player={rowPlayer}
              opponent={colPlayer}
              onGuess={handleGuess}
            />
            <td className="text-center" style={{ fontSize: 14 }}>
              {categoriesLabels[item.category]}
            </td>
            <TableCell
              playerId={item.playerId}
              isCorrect={item.isCorrect}
              category={item.category}
              player={colPlayer}
              opponent={rowPlayer}
              onGuess={handleGuess}
            />
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default PlayerComparisonTable;
