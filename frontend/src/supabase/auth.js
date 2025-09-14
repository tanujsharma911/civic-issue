

import { supabase } from '../supabase/supabase-client';

export class AuthService {
    //  abhay 9549370398
    async sendOtp(name, phoneNumber) {
        const { data, error } = await supabase.auth.signInWithOtp({
            phone: `+91${phoneNumber}`,
            options: {
                data: {
                    display_name: name,
                    role: "officer"
                }
            }
        });

        if (error) {
            return { status: "error", msg: error.message };
        }
        return {
            status: "success",
            data: data,
            msg: "OTP sent successfully! Please verify."
        };
    }

    async verifyOtp(formData, create = true) {
        const { data, error } = await supabase.auth.verifyOtp({
            phone: `+91${formData.phone}`,
            token: formData.otp,
            type: 'sms'
        });

        if (error) {
            return ({ status: 'error', msg: error.message });
        }

        if (create === false) {
            return {
                status: "success",
                session: data.session,
                msg: "OTP verified successfully!"
            };
        }

        // Step 2: Get auth_id from verified user
        const auth_id = data?.user?.id;

        if (!auth_id) {
            return { status: "error", msg: "Unable to fetch user ID after verification." };
        }

        // Step 3: Insert officer into the table
        const { error: insertError } = await supabase
            .from("officers")
            .insert({
                name: formData.name,
                phone: formData.phone,
                state: formData.state,
                city: formData.city,
                auth_id: auth_id
            });

        if (insertError) {
            return { status: "error", msg: insertError.message };
        }

        // Step 4: Success response
        return {
            status: "success",
            session: data.session,
            msg: "OTP verified & officer added successfully!"
        };
    }

    async signUp(name, email, password) {
        const { error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    display_name: name,
                    role: 'user' // Default role set to 'user'
                }
            }
        });

        if (error) {
            return ({ status: 'error', msg: error.message });
        } else {
            return ({ status: 'success', msg: 'Account created successfully! Please check your email for confirmation.' });
        }
    }

    async authoritySignUp(state, city, email, password) {
        const { error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    state: state,
                    city: city,
                    role: 'authority' // Default role set to 'authority'
                }
            }
        });

        if (error) {
            return ({ status: 'error', msg: error.message });
        } else {
            return ({ status: 'success', msg: 'Sign up successful! Please check your email for confirmation.' });
        }
    }

    async login(email, password) {
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            return ({ status: 'error', msg: error.message });
        } else {
            const userData = await supabase.auth.getSession();
            return ({ status: 'success', user: userData.data.session.user, msg: 'Sign in successful!' });
        }
    }

    async getSession() {
        const session = await supabase.auth.getSession();
        if (session) {
            return session.data.session;
        } else {
            return null;
        }
    }

    async signOut() {
        const { error } = await supabase.auth.signOut();

        if (error) {
            return ({ status: 'error', msg: error.message });
        } else {
            return ({ status: 'success', msg: 'Sign out successful!' });
        };
    }

    async getUser() {

        const { data: { user } } = await supabase.auth.getUser()

        return user;
    }
}

const authService = new AuthService();

export default authService;