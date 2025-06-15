import { ref, computed } from "vue";
import { defineStore } from "pinia";
import axiosInstance from "@/axiosInstance";

export const useTopUpStore = defineStore("topUPStore", {
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
    async store(amount, description, image) {
      try {
        let formData = new FormData();
        formData.append("amount", amount);
        formData.append("description", description);

        if (image.length > 0) {
          formData.append("image", image[0].file);
        }

        let response = await axiosInstance.post(
          `user-portal/top-up`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
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
    },
  },
});
