export const increment = (nr) => {
    return {
        type: 'INCREMENT',
        payload: nr
    }
}

export const decrement = (nr) => {
    return {
        type: 'DECREMENT',
        payload: nr
    }
}

const initialState = {
    loading: false,
    data: {},
    error: '',
}

export const get_info = () => {
    return {
        type: 'GET_INFO',
    }
}

/*const FETCH_DATA_REQUESTED = 'FETCH_DATA_REQUESTED';
const FETCH_DATA_SUCCEEDED = 'FETCH_DATA_SUCCEEDED';
const FETCH_DATA_FAILED = 'FETCH_DATA_FAILED';

export const fetchDataRequest = () => {
    return {
        type: FETCH_DATA_REQUESTED
    }
}

export const fetchDataSuccess = (data) => {
    return {
        type: FETCH_DATA_SUCCEEDED,
        payload: data,
    }
}

export const fetchDataFailed = () => {
    return {
        type: FETCH_DATA_FAILED,
        payload: error,
    }
}*/