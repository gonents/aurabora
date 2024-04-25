import API from "../../utils/APIutils"

export async function getToken(api: API, adminEmail: string, adminPassword: string) {
    await api.getReq('/admin')
    let storage = await api.getStorageState()
    let token = storage.cookies[0].name + "=" + storage.cookies[0].value
    const login = await api.postReq(
        '/admin/login',
        token,
        {
            'email': adminEmail,
            'password': adminPassword
        }
        
    )
    return token
}