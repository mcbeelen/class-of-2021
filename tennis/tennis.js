class Player {
    constructor(name) {
        this.name = name;
    }
}



class TennisMatch {

    constructor(playerOne, playerTwo, theUmpire) {
        this.playerOne = playerOne;
        this.playerTwo = playerTwo;
        this.umpire = theUmpire;

        this.setsPlayed = [];

        this.startNextSet();
    }

    startNextSet() {
        this.currentSet = new TennisSet(this.umpire);
    }

    getNumberOfSetsWonByPlayerOne = function getNumberOfSetsWonByPlayerOne() {
        return this.setsPlayed.filter((set) => set.gameWonByPlayerOne > set.gameWonByPlayerTwo).length;
    }

    getNumberOfSetsWonByPlayerTwo = function getNumberOfSetsWonByPlayerTwo() {
        return this.setsPlayed.filter((set) => set.gameWonByPlayerTwo > set.gameWonByPlayerOne).length;
    }

    getNumberOfGamesWonByPlayerOneInCurrentSet() {
        return this.currentSet.getNumberOfGameWonByPlayerOne();
    }

    getNumberOfGamesWonByPlayerTwoInCurrentSet() {
        return this.currentSet.getNumberOfGameWonByPlayerTwo();
    }

    getNumberOfPointsWonByPlayerOneInCurrentGame() {
        return this.currentSet.currentGame.getNumberOfPointsWonByPlayerOne();
    }

    getNumberOfPointsWonByPlayerTwoInCurrentGame() {
        return this.currentSet.currentGame.getNumberOfPointsWonByPlayerTwo();
    }
}

class TennisSet {
    constructor(theUmpire) {

        this.umpire = theUmpire;
        this.gamesWonByPlayerOne = 0;
        this.gamesWonByPlayerTwo = 0;

        theUmpire.currentSet = this;
        this.startNextGame();
    }

    startNextGame() {
        this.currentGame = new TennisGame(this.umpire);
    }

    getNumberOfGameWonByPlayerOne() {
        return this.gamesWonByPlayerOne;
    }
    getNumberOfGameWonByPlayerTwo() {
        return this.gamesWonByPlayerTwo;
    }

    handleGameWonByPlayerOne() {
        this.gamesWonByPlayerOne++;

        this.startNextGame()
    }

    handleGameWonByPlayerTwo() {
        this.gamesWonByPlayerTwo++;

        this.startNextGame()
    }

}

class TennisGame {
    constructor(theUmpire) {
        this.umpire = theUmpire;

        this.pointsWonByPlayerOne = 0;
        this.pointsWonByPlayerTwo = 0;

        theUmpire.currentGame = this;
    }

    handlePointScoredByPlayerOne() {
        this.pointsWonByPlayerOne++;

        if (this.pointsWonByPlayerOne >= 4 && this.pointsWonByPlayerOne - this.pointsWonByPlayerTwo >= 2) {
            this.umpire.handleGameWonByPlayerOne()
        }
    }

    handlePointScoredByPlayerTwo() {
        this.pointsWonByPlayerTwo++

        if (this.pointsWonByPlayerTwo >= 4 && this.pointsWonByPlayerTwo - this.pointsWonByPlayerOne >= 2) {
            this.umpire.handleGameWonByPlayerTwo()
        }
    }

    getNumberOfPointsWonByPlayerOne() {
        if (this.#isInEndGame()) {
            if (this.#isDeuce()) {
                return "D"
            } else if (this.#isPlayerOneAhead()) {
                return "Ad";
            } else {
                return "..";
            }
        }
        return this.#getDisplayScore(this.pointsWonByPlayerOne);
    }

    getNumberOfPointsWonByPlayerTwo() {
        if (this.#isInEndGame()) {
            if (this.#isDeuce()) {
                return "D"
            } else if (!this.#isPlayerOneAhead()) {
                return "Ad";
            } else {
                return "..";
            }
        }
        return this.#getDisplayScore(this.pointsWonByPlayerTwo);
    }

    #isInEndGame = function isInEndGame() {
        return this.pointsWonByPlayerOne >= 3 && this.pointsWonByPlayerTwo >= 3;
    }

    #isDeuce = function isDeuce() {
        return this.pointsWonByPlayerOne == this.pointsWonByPlayerTwo;
    }

    #isPlayerOneAhead = function isPlayerOneAhead() {
        return this.pointsWonByPlayerOne > this.pointsWonByPlayerTwo;
    }

    #getDisplayScore = function(pointsScored) {
        switch(pointsScored) {
            case 0: return "00";
            case 1: return "15";
            case 2: return "30";
            case 3: return "40";
        }
    }

}

class Umpire {
    constructor(announcer) {
        this.announcer = announcer
    }

    #currentMatch;
    currentSet;
    currentGame;

    startNewMatch = function startNewMatch() {

        let nameOfPlayerOne = window.prompt("Wie is de eerste speler");
        let playerOne = new Player(nameOfPlayerOne);

        let nameOfPlayerTwo = window.prompt("Tegen wie speelt "+ playerOne.name + "?");
        let playerTwo = new Player(nameOfPlayerTwo);

        this.#currentMatch = new TennisMatch(playerOne, playerTwo, this);

        this.announcer.announceNewMatch(this.#currentMatch);
    }

    startNewSet() {
        this.currentSet = new TennisSet(this)
        this.#currentMatch.currentSet = this.currentSet;
    }

    startNextGame() {
        this.currentGame = new TennisGame(this);
        this.#currentMatch.currentGame = this.currentGame;
    }

    handlePointScoredByPlayerOne() {
        this.currentGame.handlePointScoredByPlayerOne();
        this.announcer.updateScoreboard(this.#currentMatch, this.currentSet, this.currentGame)
    }

    handlePointScoredByPlayerTwo() {
        this.currentGame.handlePointScoredByPlayerTwo()
        this.announcer.updateScoreboard(this.#currentMatch, this.currentSet, this.currentGame)
    }

    handleGameWonByPlayerOne() {
        this.currentSet.handleGameWonByPlayerOne();
    }

    handleGameWonByPlayerTwo() {
        this.currentSet.handleGameWonByPlayerTwo();
    }
}


