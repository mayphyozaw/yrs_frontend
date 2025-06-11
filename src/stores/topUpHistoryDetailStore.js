import { defineStore } from "pinia";
import axiosInstance from "@/axiosInstance";


export const useTopUpHistoryDetailStore = defineStore("topUpHistoryDetailStore", {
  state: () => ({ 
    response: null, 
    error: null,
    errorMessage: null,
    errors: [],
 }),
  getters: {
    getResponse: (state) => state.response,
    getError: (state) => state.error,
    getErrorMessage: (state) => state.errorMessage,
    getErrors: (state) => state.errors,
  },
  actions: {
    async get(trx_id){
        try {
            
            let response = await axiosInstance.get(`user-portal/top-up-history/${trx_id}`);

            this.response = response.data ?? null;
            this.error = null;
            this.errorMessage = null;
            this.errors = [];
        } catch (error) {
            this.response = null;
            this.error = error;
            this.errorMessage = error?.response?.data?.message ?? null;
            this.errors = error?.response?.data?.errors ?? null;
        }
    }
  },
});
