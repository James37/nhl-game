import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import PlayerComparisonTable from "./PlayerComparisonTable";

const PlayerSelectModal = ({
  show,
  handleClose,
  rowIndex,
  colIndex,
  grid,
  topTeams,
  leftTeams,
  onGuess,
}) => {
  // console.log("topTeams", topTeams);
  // console.log("rowIndex", rowIndex);
  // console.log("leftTeams", leftTeams);
  // console.log("colIndex", colIndex);

  const rowPlayer = topTeams[colIndex].player;
  const colPlayer = leftTeams[rowIndex].player;
  // console.log(grid);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Body>
        <PlayerComparisonTable
          rowPlayer={rowPlayer}
          colPlayer={colPlayer}
          grid={grid}
          onGuess={onGuess}
        />
      </Modal.Body>
    </Modal>
  );
};

export default PlayerSelectModal;
