const MAX_DIR_INDEX = 7;

abstract class Directions {

  public static labels: CardinalLabelsType = [
    'n',
    'ne',
    'e',
    'se',
    's',
    'sw',
    'w',
    'nw',
  ];

  public static noDirection: number = -1;

  public static cardinals: AllCardinalDirectionsType = {
    n: 0,
    ne: 1,
    e: 2,
    se: 3,
    s: 4,
    sw: 5,
    w: 6,
    nw: 7,
  };

  public static scalars: ScalarCoordinatesType = [
    [0, -1],  // n
    [1, -1],  // ne
    [1, 0],   // e
    [1, 1],   // se
    [0, 1],   // s
    [-1, 1],  // sw
    [-1, 0],  // w
    [-1, -1], // nw
  ];

  public static getRandomDirection(restrictToAnatomy: boolean = false): number {
    let dir = Math.floor(Math.random() * Directions.scalars.length);

    if (restrictToAnatomy && dir % 2 !== 0) {
      dir--;
    }

    return dir;
  }

  public static getRandomScalar(): Array<number> {
    return Directions.scalars[Math.floor(Math.random() * Directions.scalars.length)];
  }

  public static getOppositeDirection(dir: number): number {
    switch (dir) {
      case Directions.cardinals.n:
        return Directions.cardinals.s;

      case Directions.cardinals.ne:
        return Directions.cardinals.sw;

      case Directions.cardinals.e:
        return Directions.cardinals.w;

      case Directions.cardinals.se:
        return Directions.cardinals.nw;

      case Directions.cardinals.s:
        return Directions.cardinals.n;

      case Directions.cardinals.sw:
        return Directions.cardinals.ne;

      case Directions.cardinals.w:
        return Directions.cardinals.e;

      case Directions.cardinals.nw:
        return Directions.cardinals.se;

      default:
        return dir;
    }
  }

  public static rotateRight(dir: number, isAnatomy: boolean = false): number {
    dir = (isAnatomy) ? dir + 2: dir + 1;

    if (dir > MAX_DIR_INDEX) {
      dir = 0;
    }

    return dir;
  }

  public static rotateLeft(dir: number, isAnatomy: boolean = false): number {
    dir = (isAnatomy) ? dir - 2: dir - 1;

    if (dir < 0) {
      dir = (isAnatomy) ? MAX_DIR_INDEX - 1 : MAX_DIR_INDEX;
    }

    return dir;
  }
}

export default Directions;
