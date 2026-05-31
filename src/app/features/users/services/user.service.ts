import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { User, LoginPayload, LoginResponse, UsersResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseUrl = 'https://dummyjson.com';
  private readonly authUrl = `${this.baseUrl}/auth`;
  private readonly usersUrl = `${this.baseUrl}/users`;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly http = inject(HttpClient);

  // --- Auth State ---
  private readonly _currentUser = signal<User | null>(null);
  private readonly _accessToken = signal<string | null>(null);
  private readonly _refreshToken = signal<string | null>(null);

  /**
   * The current authenticated user.
   */
  readonly currentUser = this._currentUser.asReadonly();

  /**
   * The authentication token.
   */
  readonly token = this._accessToken.asReadonly();

  /**
   * Whether the user is currently authenticated.
   */
  readonly isAuthenticated = computed(() => !!this._accessToken());

  constructor() {
    this.initializeSession();
  }

  // --- Auth Methods ---

  /**
   * Initializes the session from localStorage if running in a browser.
   */
  private initializeSession() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const storedToken = localStorage.getItem('accessToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          this._accessToken.set(storedToken);
          this._refreshToken.set(storedRefreshToken);
          this._currentUser.set(JSON.parse(storedUser));

          // Verify session on startup
          this.getCurrentUser().catch(() => this.refreshSession());
        }
      } catch (error) {
        console.error('Failed to initialize session:', error);
        this.logout();
      }
    }
  }

  /**
   * Authenticates a user with the provided credentials.
   */
  async login(payload: LoginPayload): Promise<LoginResponse> {
    try {
      const data = await firstValueFrom(
        this.http.post<LoginResponse>(`${this.authUrl}/login`, payload),
      );

      const { accessToken, refreshToken, ...user } = data;

      this._accessToken.set(accessToken);
      this._refreshToken.set(refreshToken);
      this._currentUser.set(user as User);

      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Refreshes the authentication token using the refresh token.
   */
  async refreshSession(): Promise<void> {
    const refreshToken = this._refreshToken();
    if (!refreshToken) {
      this.logout();
      return;
    }

    try {
      const data = await firstValueFrom(
        this.http.post<{ accessToken: string; refreshToken: string }>(`${this.authUrl}/refresh`, {
          refreshToken,
          expiresInMins: 30,
        }),
      );

      this._accessToken.set(data.accessToken);
      this._refreshToken.set(data.refreshToken);

      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
      }
    } catch (error) {
      console.error('Session refresh failed:', error);
      this.logout();
    }
  }

  /**
   * Fetches the current user profile from the API.
   * Note: The authInterceptor automatically adds the token to this request.
   */
  async getCurrentUser(): Promise<User> {
    try {
      const user = await firstValueFrom(this.http.get<User>(`${this.authUrl}/me`));

      this._currentUser.set(user);

      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('user', JSON.stringify(user));
      }

      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }

  /**
   * Logs out the current user and clears session data.
   */
  logout() {
    this._accessToken.set(null);
    this._refreshToken.set(null);
    this._currentUser.set(null);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  // --- User Management Methods ---

  /**
   * Gets a list of users with optional pagination.
   */
  async getUsers(limit = 30, skip = 0): Promise<UsersResponse> {
    const params = new HttpParams().set('limit', limit.toString()).set('skip', skip.toString());

    return firstValueFrom(this.http.get<UsersResponse>(this.usersUrl, { params }));
  }

  /**
   * Searches for users by query string.
   */
  async searchUsers(query: string): Promise<UsersResponse> {
    const params = new HttpParams().set('q', query);
    return firstValueFrom(this.http.get<UsersResponse>(`${this.usersUrl}/search`, { params }));
  }

  /**
   * Filters users by key and value.
   * Example: filterUsers('hair.color', 'Brown')
   */
  async filterUsers(key: string, value: string): Promise<UsersResponse> {
    const params = new HttpParams().set('key', key).set('value', value);
    return firstValueFrom(this.http.get<UsersResponse>(`${this.usersUrl}/filter`, { params }));
  }

  /**
   * Gets a single user by ID.
   */
  async getUserById(id: number): Promise<User> {
    return firstValueFrom(this.http.get<User>(`${this.usersUrl}/${id}`));
  }

  /**
   * Adds a new user.
   */
  async addUser(user: Partial<User>): Promise<User> {
    return firstValueFrom(this.http.post<User>(`${this.usersUrl}/add`, user));
  }

  /**
   * Updates an existing user.
   */
  async updateUser(id: number, user: Partial<User>): Promise<User> {
    return firstValueFrom(this.http.put<User>(`${this.usersUrl}/${id}`, user));
  }

  /**
   * Deletes a user by ID.
   */
  async deleteUser(id: number): Promise<User & { isDeleted: boolean; deletedOn: string }> {
    return firstValueFrom(
      this.http.delete<User & { isDeleted: boolean; deletedOn: string }>(`${this.usersUrl}/${id}`),
    );
  }
}
