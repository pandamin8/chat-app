export const generateMessage = (username: String, text: String) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

export const generateLocationMessage = (username: String, url: String) => {
    return {
        username,
        url,
        createdAt: new Date().getTime()
    }
}