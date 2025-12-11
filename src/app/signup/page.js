import { neon } from '@neondatabase/serverless';
import { v4 as uuidv4 } from 'uuid';

function SignUp() {
    async function create(formData) {
        'use server';
        // Connect to the Neon database
        const sql = neon(`${process.env.DATABASE_URL}`);
        const comment = formData.get('comment');
        // Insert the comment from the form into the Postgres database
        await sql.query('INSERT INTO "user" VALUES ($1,$2,$3,$4)', [uuidv4(),"email",'password','type']);
    }
    return (
        <form action={create}>
            <input type="text" placeholder="write a comment" name="comment" />
            <button type="submit">Submit</button>
        </form>
    );
}

export default SignUp;``