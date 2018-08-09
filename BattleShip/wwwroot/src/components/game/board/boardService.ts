import { BoardField } from "@src/client/models";
import { createTwoDimArray } from "@src/client/helper";

export class BoardService {
    private static resetBoard(board: Array<BoardField>[]) {
        for (let x = 0; x < board.length; x++) {
            for (let y = 0; y < board[x].length; y++) {
                board[x][y] = BoardField.Free;
            }
        }
    }

    public generateBoard(): Array<BoardField>[] {
        function checkIsFieldFree(board: Array<BoardField>[], x: number, y: number): boolean {
            if (x < 0 || x >= board.length || y >= board.length || y < 0) {
                return true;
            }

            return board[x][y] === BoardField.Free
        }

        const board = createTwoDimArray(10, 10, BoardField.Free);
        BoardService.resetBoard(board);

        const sizes = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

        for (const size of sizes) {
            let placed = false;
            while (!placed) {
                const xStart = Math.round(Math.random() * 9);
                const yStart = Math.round(Math.random() * 9);
                const dir = Math.round(Math.random());

                let free = true;
                for (let i = 0; i < size; i++) {
                    const xCheck = dir === 1 ? xStart : xStart + i;
                    const yCheck = dir === 0 ? yStart : yStart + i;

                    const isOutsideOfBounds = xCheck < 0 || xCheck >= board.length || yCheck < 0 || yCheck >= board.length;

                    if (isOutsideOfBounds
                        || !checkIsFieldFree(board, xCheck, yCheck)
                        || !checkIsFieldFree(board, xCheck + 1, yCheck)
                        || !checkIsFieldFree(board, xCheck + 1, yCheck + 1)
                        || !checkIsFieldFree(board, xCheck, yCheck + 1)
                        || !checkIsFieldFree(board, xCheck - 1, yCheck)
                        || !checkIsFieldFree(board, xCheck - 1, yCheck - 1)
                        || !checkIsFieldFree(board, xCheck, yCheck - 1)
                        || !checkIsFieldFree(board, xCheck - 1, yCheck + 1)
                        || !checkIsFieldFree(board, xCheck + 1, yCheck - 1)
                    ) {
                        free = false;
                    }
                }

                if (free) {
                    for (let i = 0; i < size; i++) {
                        const x = dir === 1 ? xStart : xStart + i;
                        const y = dir === 0 ? yStart : yStart + i;
                        board[x][y] = BoardField.Ship
                    }

                    placed = true;
                }
            }
        }

        return board;
    }
}