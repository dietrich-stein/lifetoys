import Anatomy from "../features/anatomy/Anatomy";
//import WorldEnvironment from "../features/environments/World/WorldEnvironment.svelte";
import Organism from "../features/organism/Organism";
//import FossilRecord from "../stats/FossilRecord";
//import Species from "../stats/Species";

type SerializableType = any; //Anatomy | WorldEnvironment | Organism | FossilRecord | Species;

// @todo: fix me
class SerializeHelper {
  public static copyNonObjects(obj: SerializableType) {
    let newObject = {};
    /*for (let key in obj) {
      if (typeof obj[key] !== 'object') newobj[key] = obj[key];
    }*/
    return newObject;
  }
  public static overwriteNonObjects(copyFrom: SerializableType, copyTo: SerializableType) {
    for (let key in copyFrom) {
      /*if (
        typeof copyFrom[key] !== 'object' &&
        typeof copyTo[key] !== 'object'
      ) {
        // only overwrite if neither are objects
        copyTo[key] = copyFrom[key];
      }*/
    }
  }
};

export default SerializeHelper;
