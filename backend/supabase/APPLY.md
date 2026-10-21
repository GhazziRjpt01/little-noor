# Apply the Little Noor SQL

The migration file is `migrations/20261020120000_profiles_children_progress.sql`. Saving it in this repo does not create tables or policies in Supabase.

## 1. Add the server environment

1. Open the Supabase project.
2. Go to **Project Settings → API**.
3. Copy the project URL into `SUPABASE_URL`.
4. Copy the **anon public** key into `SUPABASE_ANON_KEY`.
5. Leave the **service_role** key where it is. Do not put it in `.env` or the frontend.
6. Save those values in `backend/.env`, using `.env.example` as the shape.
7. In **Authentication → Sign In / Providers**, keep Email enabled.
8. For the local access test, turn off **Confirm email** so signup returns a session. Turn it back on when you want confirmation. This repo cannot change that setting for you.

## 2. Run the SQL

1. Open **SQL Editor → New query**.
2. Paste the full migration file.
3. Click **Run**.
4. A green result means the statement finished in that project. It does not mean a parent token was tested.

To list the policies after that run:

```sql
select tablename, policyname, cmd, roles
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
```

Expect policies for `profiles`, `children`, `learning_progress`, and `lessons`. The SQL editor still runs as a privileged role, so this list is not an access-boundary test.

## 3. Start the API

From `backend`:

```powershell
npm install
npm run dev
```

`GET http://localhost:5000/api/health` returns `supabase.env: "present"` when both variables are set, and `supabase.checked: false`. That means the process can see the variables. It does not mean the tables were queried.

## 4. Test the parent boundary

Use two parent accounts. Replace the passwords with your own values of at least 8 characters.

```powershell
$base = 'http://localhost:5000'
$headers = @{ 'Content-Type' = 'application/json' }

$parentA = Invoke-RestMethod -Method Post -Uri "$base/api/auth/signup" -Headers $headers -Body '{"email":"parent-a@example.com","password":"replace-parent-a-password","displayName":"Parent A"}'
$parentB = Invoke-RestMethod -Method Post -Uri "$base/api/auth/signup" -Headers $headers -Body '{"email":"parent-b@example.com","password":"replace-parent-b-password","displayName":"Parent B"}'
```

Both responses need a `session.accessToken`. If `session` is null, email confirmation is still on or the auth call did not succeed. Do not continue with an empty token.

```powershell
$tokenA = @{ Authorization = "Bearer $($parentA.session.accessToken)"; 'Content-Type' = 'application/json' }
$tokenB = @{ Authorization = "Bearer $($parentB.session.accessToken)"; 'Content-Type' = 'application/json' }

$child = Invoke-RestMethod -Method Post -Uri "$base/api/children" -Headers $tokenA -Body '{"name":"Noor","age":6}'
$childId = $child.child.id

$progressBody = '{"lessonsCompleted":1,"lessonsTotal":4,"kalimasLearned":1,"azkarCompleted":0,"quizCorrect":0,"quizTotal":0,"streak":1,"stars":1}'
Invoke-RestMethod -Method Put -Uri "$base/api/children/$childId/progress" -Headers $tokenA -Body $progressBody
```

Parent A should see the child and the saved progress:

```powershell
Invoke-RestMethod -Headers $tokenA -Uri "$base/api/children"
Invoke-RestMethod -Headers $tokenA -Uri "$base/api/children/$childId/progress"
```

Parent B should not see that child. The list should not contain `$childId`. The progress request should return HTTP 404.

```powershell
Invoke-RestMethod -Headers $tokenB -Uri "$base/api/children"
try {
  Invoke-RestMethod -Headers $tokenB -Uri "$base/api/children/$childId/progress"
} catch {
  $_.Exception.Response.StatusCode.value__
}
```

Repeat the same two calls against Supabase itself so the database policies are tested, not only the API:

```powershell
$supabase = 'https://YOUR_PROJECT_REF.supabase.co'
$anon = 'your-anon-key'

Invoke-RestMethod -Headers @{ apikey = $anon; Authorization = "Bearer $($parentA.session.accessToken)" } -Uri "$supabase/rest/v1/children?select=id,name"
Invoke-RestMethod -Headers @{ apikey = $anon; Authorization = "Bearer $($parentB.session.accessToken)" } -Uri "$supabase/rest/v1/children?select=id,name"
Invoke-RestMethod -Headers @{ apikey = $anon } -Uri "$supabase/rest/v1/children?select=id,name"
```

Parent A's REST call should include the child. Parent B's call should not. The anon call, with no parent token, should not return that child. A permission error on the anon call also means the row was not returned.

## 5. Optional lesson check

The lessons table starts empty. This sample is not religious text:

```sql
insert into public.lessons (id, title, verified, audio_url)
values ('sample-lesson', 'Sample lesson', true, null);
```

`GET /api/lessons` should list that row. `GET /api/lessons/sample-lesson/audio` should return 404 until a real `https://` audio URL is stored. An unverified row (`verified = false`) should not appear in `GET /api/lessons`.
