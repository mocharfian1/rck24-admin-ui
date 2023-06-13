import axios from "axios";

export default {
    getAllUser_Service(url, page, limit, filter, pendingFilter){
        return axios.get(`${ url }/api/getListAllUser`, {
            params: {
                page,
                itemsPerPage: limit,
                filter,
                pendingFilter
            }
        })
    },
    getAllKoordinator_Service(url, page, limit, filter, pendingFilter){
        return axios.get(`${ url }/api/getListAllKoordinator`, {
            params: {
                page,
                itemsPerPage: limit,
                filter,
                pendingFilter
            }
        })
    },
    getListUserByFilter_Service(url, page, itemsPerPage, filter) {
        return axios.get(`${ url }/api/getListUserByFilter`, {
            params: {
                page,
                itemsPerPage,
                filter
            }
        })
    },
    submitAddKoordinator_Service(url, body) {
        return axios.post(`${ url }/api/v1/koordinator/add`, body)
    },
    submitChangeStatus_Service(url, id, status) {
        return axios.post(`${ url }/api/v1/user/change_status`, {
            id,
            status
        })
    },
    getImagesByNoKtp_Service(url, no_ktp) {
        return axios.get(`${ url }/api/v1/user/get_images_by_nik`, {
            params: {
                no_ktp
            }
        })
    },
    verifyImage_Service(url, code) {
        return axios.post(`${ url }/api/v1/images/verifikasi_foto`, {
            code
        })
    }
}
