import React, { useState, useEffect } from "react";
import "./App.css";
import TeamLabel from "./TeamLabel";
import PlayerSelectModal from "./PlayerSelectModal";
import { Container, Row, Col } from "react-bootstrap";

const cat1 = ["assists", "goals", "points"];
const cat2 = [
  "shots",
  "powerPlayPoints",
  "penaltyMinutes",
  "blocked",
  "hits",
  "plusMinus",
  "timeOnIcePerGame",
  "pim",
];

// Helper function to get a random element from an array
function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Helper function to randomize categories
function getRandomizesCategories() {
  const randomCat1Property = getRandomElement(cat1);
  const randomCat2Property1 = getRandomElement(cat2);
  let randomCat2Property2;
  do {
    randomCat2Property2 = getRandomElement(cat2);
  } while (randomCat2Property2 === randomCat2Property1);

  return [
    { category: randomCat1Property, playerId: null, isCorrect: null },
    { category: randomCat2Property1, playerId: null, isCorrect: null },
    { category: randomCat2Property2, playerId: null, isCorrect: null },
  ];
}

const getInitialGridData = () => {
  const gridData = [];
  for (let i = 0; i < 3; i++) {
    const row = [];
    for (let j = 0; j < 3; j++) {
      const categories = getRandomizesCategories();
      row.push(categories);
    }
    gridData.push(row);
  }
  // console.log('gridData', gridData)
  return gridData;
};
const App = () => {
  const [topTeams, setTopTeams] = useState([]);
  const [leftTeams, setLeftTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [rowIndex, setRowIndex] = useState(null);
  const [colIndex, setColIndex] = useState(null);
  const [gridData, setGridData] = useState(getInitialGridData());

  const handlePlayerSelect = (player) => {
    setSelectedPlayer(player);
    handleClose();
  };

  // const handlePlayerSelect = (player1Stats, player2Stats) => {
  //   // Update the grid data with the selected players and their stats
  //   const updatedGridData = JSON.parse(JSON.stringify(gridData)); // Create a deep copy of the grid data
  //   updatedGridData[rowIndex][colIndex] = { player1Stats, player2Stats };
  //   setGridData(updatedGridData);

  //   // Close the modal
  //   handleClose();
  // };

  const handleShow = (row, col) => {
    // console.log([row, col]);
    // console.log(gridData[row - 1][col - 1]);
    // console.log(gridData?.[rowIndex]?.[colIndex]);
    setRowIndex(row - 1);
    setColIndex(col - 1);
    setShowModal(true);
  };

  // const handleShow = (row, col) => {
  //   const selectedCell = gridData[row][col];
  //   setRowIndex(selectedCell.topTeam);
  //   setColIndex(selectedCell.leftTeam);
  //   setShowModal(true);
  // };

  const handleClose = () => setShowModal(false);

  const getRandomPlayerWithMinGames = async (teamId) => {
    try {
      const response = await fetch(
        `https://statsapi.web.nhl.com/api/v1/teams/${teamId}/roster?season=20222023`
      );
      const data = await response.json();
      const roster = data.roster;

      const findValidPlayer = async () => {
        let randomPlayer = roster[Math.floor(Math.random() * roster.length)];

        while (randomPlayer.position.name === "Goalie") {
          randomPlayer = roster[Math.floor(Math.random() * roster.length)];
        }

        // Fetch player's individual stats
        const playerStatsResponse = await fetch(
          `https://statsapi.web.nhl.com/api/v1/people/${randomPlayer.person.id}/stats?stats=statsSingleSeason&season=20222023`
        );
        const playerStatsData = await playerStatsResponse.json();
        const playerStats = playerStatsData.stats[0].splits[0].stat;

        // Apply condition
        if (playerStats.games > 41) {
          randomPlayer.stats = playerStats;
          return randomPlayer;
        } else {
          return findValidPlayer(); // Call the function recursively until condition met
        }
      };

      return findValidPlayer();
    } catch (error) {
      console.error(`Error fetching roster for team ${teamId}:`, error);
      return null;
    }
  };

  const fetchRandomTeams = async () => {
    try {
      const response = await fetch("https://statsapi.web.nhl.com/api/v1/teams");
      const data = await response.json();
      const teams = data.teams;

      // Randomly select 3 unique teams from the list for top row
      const randomTopTeams = getRandomUniqueElements(teams, 3);
      const topTeamPlayers = await Promise.all(
        randomTopTeams.map((team) => getRandomPlayerWithMinGames(team.id))
      );

      // Randomly select 3 unique teams from the list for left column
      const randomLeftTeams = getRandomUniqueElements(
        teams.filter((team) => !randomTopTeams.includes(team)),
        3
      );
      const leftTeamPlayers = await Promise.all(
        randomLeftTeams.map((team) => getRandomPlayerWithMinGames(team.id))
      );

      const topTeamsWithRosters = randomTopTeams.map((team, index) => ({
        ...team,
        player: topTeamPlayers[index],
      }));
      const leftTeamsWithRosters = randomLeftTeams.map((team, index) => ({
        ...team,
        player: leftTeamPlayers[index],
      }));
      setTopTeams(topTeamsWithRosters);
      // console.log(topTeamsWithRosters);
      setLeftTeams(leftTeamsWithRosters);
    } catch (error) {
      console.error("Error fetching NHL teams:", error);
    }
  };

  const getRandomUniqueElements = (array, num) => {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  };

  useEffect(() => {
    fetchRandomTeams();
  }, []);

  const handleGuess = (item) => {
    const updatedGridData = [...gridData];
    const updatedItem = updatedGridData[rowIndex][colIndex].find(
      (element) => element.category === item.category
    );
    if (updatedItem) {
      updatedItem.isCorrect = item.isCorrect;
      updatedItem.playerId = item.playerId;
      if (!updatedItem.isCorrect) {
        updatedGridData[rowIndex][colIndex].background = "red";
      }
      const allGuessed = updatedGridData[rowIndex][colIndex].every(
        (item) => item.playerId !== null
      );

      if (allGuessed) {
        // Check if all three categories are guessed correctly
        const allCorrect = updatedGridData[rowIndex][colIndex].every(
          (item) => item.isCorrect
        );

        // Update the grid's background color based on the result
        if (allCorrect) {
          updatedGridData[rowIndex][colIndex].background = "green";
        }
      }
      setGridData(updatedGridData);
    }
  };

  return (
    <Container className="App">
      <Row>
        <Col xs={12}>
          <div className="grid-container">
            {[...Array(16)].map((_, index) => {
              const row = Math.floor(index / 4);
              const col = index % 4;

              return (
                <div
                  key={index}
                  className="grid-item"
                  style={{
                    background:
                      gridData?.[row - 1]?.[col - 1]?.background || "",
                  }}
                  onClick={() => {
                    index > 4 && index % 4 !== 0 && handleShow(row, col);
                  }}
                >
                  {index < 4 && index !== 0 && (
                    <TeamLabel team={topTeams[index - 1]} />
                  )}
                  {index % 4 === 0 && index !== 0 && (
                    <TeamLabel team={leftTeams[index / 4 - 1]} />
                  )}
                </div>
              );
            })}
          </div>
        </Col>
      </Row>
      {rowIndex !== null && colIndex !== null && (
        <PlayerSelectModal
          show={showModal}
          handleClose={handleClose}
          rowIndex={rowIndex}
          colIndex={colIndex}
          topTeams={topTeams}
          leftTeams={leftTeams}
          grid={gridData[rowIndex][colIndex]}
          onPlayerSelect={handlePlayerSelect}
          onGuess={handleGuess}
        />
      )}
    </Container>
  );
};

export default App;
