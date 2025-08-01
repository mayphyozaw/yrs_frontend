import { ref, computed } from "vue";
import { defineStore } from "pinia";
import axiosInstance from "@/axiosInstance";


export const useRegenerateQRStore = defineStore("regenerateQRStore", {
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
    async store(qr_token){
        try {
            
            let response = await axiosInstance.post(`user-portal/regenerate-qr`,{
              qr_token: qr_token,
            });
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
