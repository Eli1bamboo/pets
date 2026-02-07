import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function createUsers() {
    console.log("Creating Admin user...")
    const { data: adminData, error: adminError } = await supabase.auth.signUp({
        email: 'admin@demo.com',
        password: 'password123',
        options: {
            data: { full_name: 'Admin User', role: 'admin' }
        }
    })

    if (adminError) console.error("Error creating admin:", adminError.message)
    else {
        console.log("Admin created via Auth. ID:", adminData.user?.id)
        if (adminData.user) {
            const { error: profileError } = await supabase.from('profiles').upsert({
                id: adminData.user.id,
                full_name: 'Admin User',
                role: 'admin',
                updated_at: new Date()
            })
            if (profileError) console.error("Error updating admin profile:", profileError.message)
            else console.log("Admin profile configured.")
        }
    }

    console.log("\nCreating Customer user...")
    const { data: custData, error: custError } = await supabase.auth.signUp({
        email: 'cliente@demo.com',
        password: 'password123',
        options: {
            data: { full_name: 'Cliente Demo', role: 'customer' }
        }
    })

    if (custError) console.error("Error creating customer:", custError.message)
    else {
        console.log("Customer created. ID:", custData.user?.id)
        if (custData.user) {
            const { error: profileError } = await supabase.from('profiles').upsert({
                id: custData.user.id,
                full_name: 'Cliente Demo',
                role: 'customer',
                updated_at: new Date()
            })
            if (profileError) console.error("Error updating customer profile:", profileError.message)
            else console.log("Customer profile configured.")
        }
    }
}

createUsers()
