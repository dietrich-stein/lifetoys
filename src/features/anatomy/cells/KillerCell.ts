import CellStates from '../CellStates';
import Cell from '../Cell';
import GridCell from '../../grid/GridCell';
import Organism from '../../organism/Organism';
import GridMap from '../../grid/GridMap';
import FossilRecord from '../../stats/FossilRecord';
import { HyperparamsState } from '../../world/WorldManagerSlice';

class KillerCell extends Cell {
  constructor(org: Organism, loc_col: number, loc_row: number, hyperparams: HyperparamsState) {
    super(CellStates.killer, org, loc_col, loc_row, hyperparams);
  }

  initInherit(parent: Cell) {
    // deep copy parent values
    super.initInherit(parent);
  }

  initRandom() {
    // initialize values randomly
  }

  initDefault() {
    // initialize to default values
  }

  performFunction(grid_map: GridMap, fossil_record: FossilRecord, ticks: number) {
    if (this.org.environment !== 'world') {
      return;
    }

    var c = this.getRealCol();
    var r = this.getRealRow();

    const killableNeighbors = this.hyperparams.killableNeighbors;

    for (var loc of killableNeighbors) {
      var cell = grid_map.cellAt(c + loc[0], r + loc[1]);

      if (cell !== null) {
        this.killNeighbor(grid_map, fossil_record, ticks, cell);
      }
    }
  }

  killNeighbor(grid_map: GridMap, fossil_record: FossilRecord, ticks: number, neighbor_cell: GridCell) {
    if (
      neighbor_cell === null ||
      neighbor_cell.owner_org === null ||
      neighbor_cell.owner_org === this.org ||
      !neighbor_cell.owner_org.living ||
      neighbor_cell.state === CellStates.armor
    ) {
      return;
    }

    var is_hit = neighbor_cell.state === CellStates.killer; // has to be calculated before death

    neighbor_cell.owner_org.harm(grid_map, fossil_record, ticks);

    const instaKill = this.hyperparams.instaKill;

    if (instaKill && is_hit) {
      this.org.harm(grid_map, fossil_record, ticks);
    }
  }
}

export default KillerCell;
