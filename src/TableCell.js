import React from "react";
import { Button } from "react-bootstrap";

const TableCell = ({
  playerId,
  isCorrect,
  category,
  player,
  opponent,
  onGuess,
}) => {
  const handleGuess = () => {
    if (isCorrect === null) {
      const isCorrect = player.stats[category] > opponent.stats[category];
      onGuess(category, isCorrect, player.person.id);
    }
  };

  return (
    <td
      className={`text-center ${
        playerId === player.person.id && isCorrect
          ? "correct"
          : playerId === player.person.id && !isCorrect
          ? "wrong"
          : ""
      }`}
    >
      {isCorrect !== null ? (
        player.stats[category]
      ) : (
        <Button variant="success" size="sm" onClick={handleGuess}>
          Guess
        </Button>
      )}
    </td>
  );
};

export default TableCell;
