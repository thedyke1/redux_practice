import * as types from "./types";

export const setCharaters = (payload) => ({
  type: types.SET_CHARACTERS,
  payload,
});

export const setLoadingState = (payload) => ({
  type: types.LOADING,
  payload,
});

export const setCharaterById = (payload) => ({
  type: types.SET_CHARACTER_BY_ID,
  payload,
});

// GET QUOTE OF THE DAY
export const getCharacters = (axios) => (dispatch, getState) => {
  const state = getState();

  if (state.data.characters) {
    dispatch(
      setCharaters({
        currentPage: state.currentPage,
        nextPage: state.nextPage,
        results: state.data.characters,
        loading: false,
      })
    );
  }

  if (Object.keys(state.data).length === 0) {
    axios
      .get("https://rickandmortyapi.com/api/character")
      .then(({ data }) => {
        dispatch(setLoadingState({ loading: true }));
        const res = data.results;
        const nextPage = data.info.next;
        const urlParams = new URLSearchParams(nextPage);
        const currentPage = urlParams.get("page") ?? 1;
        dispatch(
          setCharaters({
            currentPage: currentPage,
            nextPage: nextPage,
            results: res,
            loading: false,
          })
        );
      })
      .catch((error) => {
        let message =
          "There was an error getting the rick and morti character information";
        if (error.response) {
          message = `Server responded with status ${error.response.status}`;
        }
      });
  }
};

export const getCharacterById = (axios, id) => (dispatch, getState) => {
  const state = getState();

  if (state.data.characters) {
    const results = state.data.characters;
    const result = results.find((element) => element.id == id) ?? "";

    dispatch(
      setCharaterById({
        results: results,
        result: result,
        currentPage: state.data.currentPage,
        nextPage: state.data.nextPage,
      })
    );
  }

  if (Object.keys(state.data).length === 0 && id) {
    axios
      .get("https://rickandmortyapi.com/api/character")
      .then(({ data }) => {
        const res = data.results;
        const result = res.find((element) => element.id == id);

        dispatch(
          setCharaterById({
            results: res,
            result: result,
          })
        );
      })
      .catch((error) => {
        let message =
          "There was an error getting the rick and morti character information";
        if (error.response) {
          message = `Server responded with status ${error.response.status}`;
        }
      });
  }
};

// RESET CHARACTERS
export const resetCharacters = () => ({ type: types.RESET });
