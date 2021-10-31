import {rootState} from "../../store/reducers";
import get from "lodash/get";
import {GENERAL_PATH} from "./reducer";
import {dodProfileState} from "./types";

export const getStateData = (state: rootState): dodProfileState => get(state, GENERAL_PATH);

export const getWorkProgramList = (state: rootState): Array<any> => get(getStateData(state),"workProgramList", [])
export const getAllCount = (state: rootState): number => get(getStateData(state),"allCount", 0)
export const getCurrentPage = (state: rootState): number => get(getStateData(state),"currentPage", 1)
export const getTableMode = (state: rootState): number => get(getStateData(state),"tableMode", 1)

