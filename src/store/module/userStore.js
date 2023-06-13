import UserServices from "@/services/UserServices";

export const namespaced = true;

export const state = {
    loading: false,
    loading_submit: false,
    loading_image_verify: false,
    data_user: [],
    data_count: 0,
    data_images: [],
    data_images_count: 0,
    // totalDataSubmit: 0,
    notification: {
        text: "",
        color: "success",
        show: false
    },
    // buttonUpload:{
    //     btnUploadStatus: 0,
    //     btnRetryStatus: '',
    //     lblUploadStatus: 'Tambah File',
    //     txtUploadLabel: 'Drop file kamu disini untuk upload',
    //     typeUploadStatus: 'success',
    // }
};

export const mutations = {
    SET_DATA_ALL_USER(state, dataServer) {
        const { data, totalData } = dataServer.record;
        state.data_user = data;
        state.data_count = totalData
        if(totalData > 0){
            state.data_user.map((v, i) => {
                state.data_user[i]['loading'] = false
            })
        }
    },
    SET_DATA_IMAGES(state, dataServer) {
        const { data, totalData } = dataServer.record;
        console.log('===> ', dataServer.record)
        state.data_images = data;
        state.data_images_count = totalData
        if(totalData > 0){
            state.data_user.map((v, i) => {
                state.data_user[i]['loading'] = false
            })
        }
    },
    SET_START_LOADING(state) {
        state.loading = true;
    },
    SET_FINISH_LOADING(state) {
        state.loading = false;
    },
    SET_START_LOADING_SUBMIT(state) {
        state.loading_submit = true;
    },
    SET_FINISH_LOADING_SUBMIT(state) {
        state.loading_submit = false;
    },
    SET_START_LOADING_SUBMIT_VERIFICATION_IMAGES(state) {
        state.loading_image_verify = true;
    },
    SET_FINISH_LOADING_SUBMIT_VERIFICATION_IMAGES(state) {
        state.loading_image_verify = false;
    },
    CLEAR_DATA(state) {
        state.data_user = [];
        state.data_count = 0
        state.notification = {}
    },
    CLEAR_DATA_IMAGES(state) {
        state.data_images = [];
        state.data_images_count = 0
    },
    SHOW_NOTIFICATION(state, data) {
        const { notificationText, type } = data;
        state.notification.text = notificationText;
        state.notification.color = type;
        state.notification.show = true;
    },
    HIDE_NOTIFICATION(state) {
        state.notification.text = "";
        state.notification.show = false;
    },

};

export const actions = {
    getListAllUser({ commit, dispatch }, params) {
        commit("SET_START_LOADING", {});
        const { url, page, itemsPerPage, filter, pendingFilter } = params;
        return UserServices.getAllUser_Service(url, page, itemsPerPage, filter, pendingFilter)
            .then(({ data }) => {
                commit("SET_FINISH_LOADING", {});
                commit("SET_DATA_ALL_USER", { record: data });
            })
            .catch(err => {
                console.error(err);
                commit("SET_FINISH_LOADING", {});
                dispatch("addNotification", {
                    notificationText: err.response ? err.response.data.error : err,
                    type: "error"
                });
            });
    },
    getImagesByNik({ commit, dispatch }, params) {
        commit("SET_START_LOADING", {});
        const { url, no_ktp } = params;
        return UserServices.getImagesByNoKtp_Service(url, no_ktp)
            .then(({ data }) => {
                console.log('===> ', data)
                commit("SET_FINISH_LOADING", {});
                commit("SET_DATA_IMAGES", { record: data });
            })
            .catch(err => {
                console.error(err);
                commit("SET_FINISH_LOADING", {});
                dispatch("addNotification", {
                    notificationText: err.response ? err.response.data.error : err,
                    type: "error"
                });
            });
    },
    getListAllKoordinator({ commit, dispatch }, params) {
        commit("SET_START_LOADING", {});
        const { url, page, itemsPerPage, filter, pendingFilter } = params;
        return UserServices.getAllKoordinator_Service(url, page, itemsPerPage, filter, pendingFilter)
            .then(({ data }) => {
                commit("SET_FINISH_LOADING", {});
                commit("SET_DATA_ALL_USER", { record: data });
            })
            .catch(err => {
                console.error(err);
                commit("SET_FINISH_LOADING", {});
                dispatch("addNotification", {
                    notificationText: err.response ? err.response.data.error : err,
                    type: "error"
                });
            });
    },
    clearData({ commit }) {
        commit("CLEAR_DATA", {});
    },
    clearDataImages({ commit }) {
        commit("CLEAR_DATA_IMAGES", {});
    },
    addNotification({ commit, dispatch }, params) {
        const { notificationText, type } = params;

        dispatch("closeNotification", {});
        setTimeout(() => {
            commit("SHOW_NOTIFICATION", { notificationText, type });
        }, 250);
    },
    closeNotification({ commit }) {
        commit("HIDE_NOTIFICATION", {});
    },
    submitAddKoordinator({ commit, dispatch }, params){
        commit("SET_START_LOADING_SUBMIT", {});
        const { url, body } = params;
        return UserServices.submitAddKoordinator_Service(url, body)
            .then(({ data }) => {
                commit("SET_FINISH_LOADING_SUBMIT", {});
                if(data.statusCode === '00'){
                    dispatch("addNotification", {
                        notificationText: data.statusDesc,
                        type: "success"
                    });
                    return { closeDialog: true }
                }else{
                    dispatch("addNotification", {
                        notificationText: data ? data.statusDesc : 'Terjadi kesalahan. Err Code (101)',
                        type: "error"
                    });
                    return { closeDialog: false }
                }

            })
            .catch(err => {
                console.error('===> ERROR ', err.response.data);
                commit("SET_FINISH_LOADING_SUBMIT", {});
                dispatch("addNotification", {
                    notificationText: err.response ? err.response.data.statusDesc : 'Terjadi Kesalahan. Harap hubungi admin',
                    type: "error"
                });
                return { closeDialog: false }
            });
    },
    changeStatus({ commit, dispatch }, params){
        commit("SET_START_LOADING_SUBMIT", {});
        const { url, id, status } = params;
        return UserServices.submitChangeStatus_Service(url, id, status)
            .then(({ data }) => {
                commit("SET_FINISH_LOADING_SUBMIT", {});
                if(data.statusCode === 200){
                    dispatch("addNotification", {
                        notificationText: data.statusDesc,
                        type: "success"
                    });
                    return { closeDialog: true }
                }else{
                    dispatch("addNotification", {
                        notificationText: data ? data.statusDesc : 'Terjadi kesalahan. Err Code (101)',
                        type: "error"
                    });
                    return { closeDialog: false }
                }

            })
            .catch(err => {
                console.error('===> ERROR ', err.response.data);
                commit("SET_FINISH_LOADING_SUBMIT", {});
                dispatch("addNotification", {
                    notificationText: err.response ? err.response.data.statusDesc : 'Terjadi Kesalahan. Harap hubungi admin',
                    type: "error"
                });
                return { closeDialog: false }
            });
    },
    verifyImage({ commit, dispatch }, params){
        commit("SET_START_LOADING_SUBMIT_VERIFICATION_IMAGES", {});
        const { url, code } = params;
        return UserServices.verifyImage_Service(url, code)
            .then(({ data }) => {
                commit("SET_FINISH_LOADING_SUBMIT_VERIFICATION_IMAGES", {});
                if(data.statusCode === 200){
                    dispatch("addNotification", {
                        notificationText: data.statusDesc,
                        type: "success"
                    });

                    const indexImg = state.data_images.findIndex(x => x.code === code)
                    state.data_images[indexImg].status = 'APPROVED'
                    return { closeDialog: true }
                }else{
                    dispatch("addNotification", {
                        notificationText: data ? data.statusDesc : 'Terjadi kesalahan. Err Code (101)',
                        type: "error"
                    });
                    return { closeDialog: false }
                }

            })
            .catch(err => {
                console.error('===> ERROR ', err.response.data);
                commit("SET_FINISH_LOADING_SUBMIT_VERIFICATION_IMAGES", {});
                dispatch("addNotification", {
                    notificationText: err.response ? err.response.data.statusDesc : 'Terjadi Kesalahan. Harap hubungi admin',
                    type: "error"
                });
                return { closeDialog: false }
            });
    }
};
