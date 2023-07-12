import Anatomy from '../features/anatomy/Anatomy';
import Cell from '../features/anatomy/Cell';
import Organism from '../features/organism/Organism';
import FossilRecord from '../features/stats/FossilRecord';
import Species from '../features/stats/Species';

type SerializableType = Anatomy | Organism | FossilRecord | Species | Cell;

class SerializeHelper {
  public static copyNonObjects(object: SerializableType) {
    let newObject: any = {};

    for (let key in object) {
      if (typeof object[key as keyof SerializableType] !== 'object') {
        newObject[key] = object[key as keyof SerializableType];
      }
    }

    return newObject;
  }

  public static overwriteNonObjects(copyFrom: SerializableType, copyTo: SerializableType) {
    for (let key in copyFrom) {
      if (
        typeof copyFrom[key as keyof SerializableType] !== 'object' &&
        typeof copyTo[key as keyof SerializableType] !== 'object'
      ) {
        // only overwrite if neither are objects
        copyTo[key as keyof SerializableType] = copyFrom[key as keyof SerializableType];
      }
    }
  }
};

export default SerializeHelper;
