/* 
 * Number puzzles 2018.0.0.0
 * 
 * Author - Sachin
 * Date - 31-Nov-2018
 * TBD: Add sound
 *      
 */


$("#sizePicker").submit(function (e) {
    e.preventDefault();
    PZN.Commands.makeGrid();
});


PZN = {};

PZN.Consts = {
    DEBUG_MODE: true,
    CELL_SIZE: 80,
    NO_COLOR: "rgba(0, 0, 0, 0)",

    HTML_ROW_START_TAG: '<tr class="number-row">',
    HTML_ROW_END_TAG: '</tr>'
}

PZN.Data = {
    puzzleCellColl: null
}


PZN.UI = {
    grid: null,
    gridHeight: 4,
    gridWidth: 4,

    initPage: function() {
    },

    swapCells: function (cell) {
        try {
            if (cell.hasClass("empty-class")) {
                cell.fadeOut(100).fadeIn(100);
                return;
            }

            // check if cell clicked can be moved.
            if (!PZN.CommandHelper.canCellBeMoved(cell)) {
                return;
            }

            let row = cell.closest("tr");
            let indexInArray = (row.index() * PZN.UI.gridHeight) + cell.index();
            let cellClickedVal = PZN.Data.puzzleCellColl[indexInArray];
            let emptyCell = PZN.UI.grid.find(".empty-cell");
            let emptyCellRow = emptyCell.closest("tr");
            let emptyCellIndexInArray = (emptyCellRow.index() * PZN.UI.gridHeight) + emptyCell.index();
            PZN.Data.puzzleCellColl[emptyCellIndexInArray] = cellClickedVal;
            //cell.fadeOut();
            emptyCell.removeClass("empty-cell").addClass("number-cell").find("div").text(cellClickedVal);
            cell.addClass("empty-cell").removeClass("number-cell").find("div").text("");
            cell.fadeIn();
        }
        catch (ex) {
            PZN.Helpers.logException(ex);
        }
        finally {

        }
    }
}

PZN.Events = {
    bindEvents: function () {
        try {
            $("#drawingCanvas").on("click", "td", function () {
                PZN.UI.swapCells($(this));
            });
        }
        catch (ex) {
            PZN.Helpers.logException(ex);
        }
        finally {

        }
    },

    onRefreshClicked: function() {
        try {
            PZN.Commands.makeGrid();
        }
        catch (ex) {
            PZN.Helpers.logException(ex);
        }
        finally {

        }
    },

    onGridSizeChangeClicked: function (squareDim) {
        try {
            PZN.UI.gridWidth = squareDim;
            PZN.UI.gridHeight = squareDim;
            PZN.Commands.makeGrid();
        }
        catch (ex) {
            PZN.Helpers.logException(ex);
        }
        finally {

        }
    }
}

PZN.UIHelper = {
    getCellHtml: function (number) {
        return `<td class="number-cell"><button class="btn"><div class="number">${number}</div></button></td>`;
    },

    getEmptyCellHtml: function () {
        return `<td class="empty-cell"><button class="btn"><div class="number"></div></button></td>`;
    }
}


PZN.Commands = {
    makeGrid: function () {
        try {
            // Create table
            PZN.UI.grid = $("#drawingCanvas");
            PZN.UI.grid.children().remove();
            PZN.CommandHelper.createTable(PZN.UI.grid, PZN.UI.gridWidth, PZN.UI.gridHeight);
        }
        catch (ex) {
            PZN.Helpers.logException(ex);
        }
        finally {
        }
    },

    colorTableCell: function (cell) {
        try {
            let cellColor = cell.css("background-color");
            if (cellColor === PZN.Consts.NO_COLOR) {
                const color = $("#colorPicker").val();
                cell.css("background-color", color);
            } else {
                cell.css("background-color", "transparent");
            }
        }
        catch (ex) {
            PZN.Helpers.logException(ex);
        }
        finally {
        }
    },

    clearGrid: function () {
        try {
            $("#drawingCanvas").children().remove();            
        }
        catch (ex) {
            PZN.Helpers.logException(ex);
        }
        finally {
        }
    }
}


PZN.CommandHelper = {
    createTable: function (table, width, height) {
        const numCells = width * height;
        // generate random numbers for puzzle grid
        PZN.Data.puzzleCellColl = PZN.Helpers.getPuzzleCellColl(numCells);

        let tableContentHtml = "";
        let cellCount = 0;
        for (let row = 0; row < height; ++row) {
            tableContentHtml += PZN.Consts.HTML_ROW_START_TAG;
            for (let col = 0; col < width; ++col) {
                let htmlCell = "";
                if (cellCount !== numCells - 1) {
                    htmlCell = PZN.UIHelper.getCellHtml(PZN.Data.puzzleCellColl[cellCount++]);
                } else {
                    htmlCell = PZN.UIHelper.getEmptyCellHtml();
                }
                tableContentHtml += htmlCell;
            }
            tableContentHtml += PZN.Consts.HTML_ROW_END_TAG;
        }
        table.append(tableContentHtml);
    },

    canCellBeMoved: function (cell) {
        // diagonal move is not allowed
        let emptyCell = PZN.UI.grid.find(".empty-cell");
        let emptyRowIndex = emptyCell.closest("tr").index();
        let emptyColIndex = emptyCell.index();
        let rowIndex = cell.closest("tr").index();
        let colIndex = cell.index();

        // Check if top cell is empty
        if ((rowIndex - 1) === emptyRowIndex && colIndex === emptyColIndex) {
            return true;
        }

        // Check if bottom is empty
        if ((rowIndex + 1) === emptyRowIndex && colIndex === emptyColIndex) {
            return true;
        }

        // Check if left cell is empty
        if (rowIndex === emptyRowIndex && (colIndex - 1) === emptyColIndex) {
            return true;
        }

        // Check if right cell is empty
        if (rowIndex === emptyRowIndex && (colIndex + 1) === emptyColIndex) {
            return true;
        }

        return false;
    }
}


PZN.Helpers = {
    getPuzzleCellColl: function (max) {
        let randomNumbers = [];
        let numberMap = new Object();
        let totalRandNumbers = 0, randNumber = 0;
        while (totalRandNumbers < (max - 1)) {
            randNumber = PZN.Helpers.generateRandomNumber(max - 1);
            if (numberMap[randNumber] === undefined) {
                numberMap[randNumber] = totalRandNumbers;
                randomNumbers.push(randNumber);
                totalRandNumbers++;
            }
        }
        return randomNumbers;
    },

    generateRandomNumber: function(max) {
        return Math.floor((Math.random() * max) + 1);
    },

    logException: function (ex) {
        if (!ex) return;

        if (PZN.Consts.DEBUG_MODE === true) {
            console.log(ex.Message);
        }
    }
}

$(document).ready(function () {
    try {
        PZN.UI.initPage();
        PZN.Events.bindEvents();
        PZN.Commands.makeGrid();
    }
    catch (ex) {
        PZN.Helpers.logException(ex);
    }
    finally {

    }
});
