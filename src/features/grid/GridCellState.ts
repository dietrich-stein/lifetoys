import CellStates from '../anatomy/CellStates';
import GridCell from './GridCell';

interface GridCellStateInterface {
  name: string;
  color: null | string;
  render: null | ((ctx: CanvasRenderingContext2D, cell: GridCell, size: number) => void);
}

class GridCellState implements GridCellStateInterface {
  name: string;
  color: string;

  constructor(name: string) {
    this.name = name;
    this.color = 'white'; // black;
  }

  render(ctx: CanvasRenderingContext2D, cell: GridCell, size: number) {
    ctx.fillStyle = this.color;
    ctx.fillRect(cell.x, cell.y, size, size);

    if (
      cell.owner_cell === null ||
      (
        cell.owner_cell.state !== CellStates.eye //&&
        //cell.owner_cell.state !== CellStates.mouth
      )
    ) {
      return;
    }

    // Render the eye slit
    ctx.fillStyle = this.color;
    ctx.fillRect(cell.x, cell.y, size, size);

    if (size === 1) {
      return;
    }

    var half = size / 2;
    var x = -size / 8;
    var y = -half;
    var h = size / 2 + size / 4;
    var w = size / 4;

    ctx.translate(cell.x + half, cell.y + half);
    var abs_dir = cell.owner_cell.org.rotation_direction; //cell.owner_cell.org.getAbsoluteDirection();

    if (cell.owner_cell.org.environment === 'editor') {
      console.log('GridCellState.render: abs_dir = ', abs_dir);
    }

    ctx.rotate((abs_dir * 45 * Math.PI) / 180);
    ctx.fillStyle = CellStates.eye.slit_color;
    ctx.fillRect(x, y, w, h);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}

export default GridCellState;
