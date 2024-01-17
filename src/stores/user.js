import axios from 'axios'
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {useToast} from 'vue-toastification'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('user', () => {

    const toast = useToast()
    const router = useRouter()
    const user = ref(null)
    const userName = computed(() => user.value?.name ?? 'Anonymous')
    const userType = computed(() => user.value?.role ?? "None")

    function clearUser () {
        delete axios.defaults.headers.common.Authorization
        sessionStorage.removeItem('token')
        user.value = null
    }

    async function login(credentials) {
        try {
            const response = await axios.post('/auth/login', credentials)
            console.log(response.data)
            axios.defaults.headers.common.Authorization = "Bearer " + response.data.token
            user.value = response.data.user
            sessionStorage.setItem('token', response.data.token)
            console.log(user.value)
            return true
        }
        catch(error) {
            clearUser()
            toast.error('User credentials are invalid!')
            return false
        }
    }

    async function loadUser () {
        try {
            const response = await axios.get('/auth/user')
            console.log(response.data)
            user.value = response.data
            return true
        } catch (error) {
            clearUser()
            return false
        }
    }

    
    async function logout () {
        try {
            clearUser()
            router.push({ name: 'home' })
            return true
        } catch (error) {
            return false
        }
    }

    async function restoreToken () {
        let storedToken = sessionStorage.getItem('token')
        if (storedToken) {
        axios.defaults.headers.common.Authorization = "Bearer " + storedToken
        await loadUser()
        return true
        }
        clearUser()
        return false
    }

    return { user, userName, userType, loadUser, clearUser, login, logout, restoreToken}
})