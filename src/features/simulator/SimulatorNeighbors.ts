abstract class Neighbors {
  //all       ...
  //          .x.
  //          ...
  public static all: DirectionCoordinates = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
    [-1, -1],
    [1, 1],
    [-1, 1],
    [1, -1],
  ];

  //adjacent   .
  //          .x.
  //           .
  public static adjacent: DirectionCoordinates = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  //corners   . .
  //           x
  //          . .
  public static corners: DirectionCoordinates = [
    [-1, -1],
    [1, 1],
    [-1, 1],
    [1, -1],
  ];

  //allSelf   ...
  //          ...
  //          ...
  public static allSelf: DirectionCoordinates = [
    [0, 0],
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
    [-1, -1],
    [1, 1],
    [-1, 1],
    [1, -1],
  ];

  public static inRange(range: number) {
    var neighbors = [];

    for (var i = -range; i <= range; i++) {
      for (var j = -range; j <= range; j++) {
        neighbors.push([i, j]);
      }
    }

    return neighbors;
  }
};

export default Neighbors;
