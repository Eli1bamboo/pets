# Development Workflow

## ⚙️ Development Workflow
### Commands
- **Start Dev Server**: `npm run dev`
- **Build & Verify**: `npm run build` (Run this **ALWAYS** before finishing a task involving code changes).
- **Lint**: `npm run lint`
- **Type Check**: `npm run type-check` (Faster than build for checking types).
- **Test**: `npm run test` (Run unit/component tests).

### Version Control (GitHub Flow)
1.  **Main Branches**:
    - `main`: Production-ready code.
    - `develop`: Integration branch for ongoing work.
2.  **Feature Branches**:
    - Format: `feature/short-description` or `fix/issue-description`.
    - Create off `develop`.
3.  **Checkin Process**:
    - Commit format: `type: summary` (e.g., `feat: add sidebar`, `fix: login race condition`).
    - **Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.
    - **Scopes**: Do NOT use scopes. Keep it simple.
    - **Push/Merge Policy**: Do NOT push to origin or merge branches automatically. Wait for explicit user instruction (e.g., "Push changes", "Merge PR").
    - **Merge Strategy**: Merge `develop` into `main` only on approval.

### Credentials
- **Test Users**: See `TEST_CREDENTIALS.md` (Note: This file is `.gitignored` to protect sensitive data).
- **Mock Data**: Use `mock_history_data.sql` for generating test scenarios. **Critical**: Use valid statuses ('completed', 'cancelled', 'pending', 'ready').

## 🛡 Verification Checklist
Before finishing a task:
1.  **Build Check**: Does `npm run build` pass?
2.  **Lint Check**: Are there new lint errors?
3.  **Visual Check**: Did you verify the UI changes?
4.  **Isolation Check**: Did you ensure NO Admin code is imported into Customer features (and vice versa)?
5.  **Consistency**: Did you follow the `useSidebar` pattern?
