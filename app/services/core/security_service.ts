import axios, { AxiosInstance } from 'axios'
import env from '#start/env'
import { User } from '#models/core/index'

export default class SecurityService {
  private axiosInstance: AxiosInstance

  constructor() {
    // Create axios instance for ms-security communication
    this.axiosInstance = axios.create({
      baseURL: env.get('MS_SECURITY'),
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  /**
   * Get all users from ms-security
   */
  async findAll(): Promise<User[]> {
    try {
      const response = await this.axiosInstance.get('/users')
      const users = response.data as User[]
      // Hide passwords in response
      users.forEach((user) => {
        if (user.password) {
          user.password = '********'
        }
      })
      return users
    } catch (error: any) {
      console.error('Error fetching all users:', error.message)
      throw new Error(`Failed to fetch users: ${error.message}`)
    }
  }

  /**
   * Find a user by ID
   */
  async findById(id: string): Promise<User | null> {
    try {
      const response = await this.axiosInstance.get(`/users/${id}`)
      const user = response.data as User
      // Hide password in response
      if (user.password) {
        user.password = '********'
      }
      return user
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn(`User not found with ID: ${id}`)
        return null
      }
      console.error(`Error fetching user by ID ${id}:`, error.message)
      throw new Error(`Failed to fetch user: ${error.message}`)
    }
  }

  /**
   * Find a user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      const response = await this.axiosInstance.get(`/users/email/${email}`)
      const user = response.data as User
      // Hide password in response
      if (user.password) {
        user.password = '********'
      }
      return user
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn(`User not found with email: ${email}`)
        return null
      }
      console.error(`Error fetching user by email ${email}:`, error.message)
      throw new Error(`Failed to fetch user by email: ${error.message}`)
    }
  }

  /**
   * Verify if an email exists
   */
  async verifyEmail(email: string): Promise<boolean> {
    try {
      const response = await this.axiosInstance.get(`/users/verify-email/${email}`)
      return response.data.exists as boolean
    } catch (error: any) {
      console.error(`Error verifying email ${email}:`, error.message)
      throw new Error(`Failed to verify email: ${error.message}`)
    }
  }

  /**
   * Check if an email exists
   */
  async emailExists(email: string): Promise<boolean> {
    return this.verifyEmail(email)
  }

  /**
   * Create a new user in ms-security
   */
  async create(userData: Partial<User>): Promise<User> {
    try {
      const response = await this.axiosInstance.post('/users', userData)
      const user = response.data as User
      console.log(`User created successfully with ID: ${user._id}`)
      return user
    } catch (error: any) {
      if (error.response?.data?.error) {
        console.error(`Error creating user: ${error.response.data.error}`)
        throw new Error(error.response.data.error)
      }
      console.error('Error creating user:', error.message)
      throw new Error(`Failed to create user: ${error.message}`)
    }
  }

  /**
   * Update an existing user
   */
  async update(id: string, userData: Partial<User>): Promise<User | null> {
    try {
      const response = await this.axiosInstance.put(`/users/${id}`, userData)
      const user = response.data as User
      console.log(`User updated successfully: ${user.email}`)
      return user
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn(`User not found for update with ID: ${id}`)
        return null
      }
      if (error.response?.data?.error) {
        console.error(`Error updating user: ${error.response.data.error}`)
        throw new Error(error.response.data.error)
      }
      console.error(`Error updating user with ID ${id}:`, error.message)
      throw new Error(`Failed to update user: ${error.message}`)
    }
  }

  /**
   * Delete a user by ID
   */
  async delete(id: string): Promise<boolean> {
    try {
      await this.axiosInstance.delete(`/users/${id}`)
      console.log(`User deleted successfully with ID: ${id}`)
      return true
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn(`User not found for deletion with ID: ${id}`)
        return false
      }
      console.error(`Error deleting user with ID ${id}:`, error.message)
      throw new Error(`Failed to delete user: ${error.message}`)
    }
  }

  /**
   * Associate a session to a user
   */
  async matchSession(userId: string, sessionId: string): Promise<boolean> {
    try {
      await this.axiosInstance.put(`/users/${userId}/session/${sessionId}`)
      console.log(`Session associated successfully to user ID: ${userId}`)
      return true
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn(`User or session not found. User ID: ${userId}, Session ID: ${sessionId}`)
        return false
      }
      console.error(`Error associating session ${sessionId} to user ${userId}:`, error.message)
      throw new Error(`Failed to associate session: ${error.message}`)
    }
  }

  /**
   * Authenticate a user (login)
   */
  async authenticate(email: string, password: string): Promise<User | null> {
    try {
      const response = await this.axiosInstance.post('/auth/login', {
        email,
        password,
      })
      return response.data as User
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 404) {
        console.warn(`Authentication failed for email: ${email}`)
        return null
      }
      console.error(`Error authenticating user ${email}:`, error.message)
      throw new Error(`Failed to authenticate: ${error.message}`)
    }
  }

  /**
   * Validate a token
   */
  async validateToken(token: string): Promise<User | null> {
    try {
      const response = await this.axiosInstance.post('/auth/validate', {
        token,
      })
      return response.data as User
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 404) {
        console.warn('Invalid or expired token')
        return null
      }
      console.error('Error validating token:', error.message)
      throw new Error(`Failed to validate token: ${error.message}`)
    }
  }

  /**
   * Logout a user (invalidate session/token)
   */
  async logout(userId: string): Promise<boolean> {
    try {
      await this.axiosInstance.post('/auth/logout', { userId })
      console.log(`User logged out successfully: ${userId}`)
      return true
    } catch (error: any) {
      console.error(`Error logging out user ${userId}:`, error.message)
      throw new Error(`Failed to logout: ${error.message}`)
    }
  }
}
