import { experience } from '../data/experience';

/** Timeline entries (in display order) that list `skillName` among their skills. */
export function entriesForSkill(skillName) {
    return experience.filter((entry) => entry.skills?.includes(skillName));
}

/** How many timeline entries used a given skill — 0 for skills not yet shipped anywhere. */
export function usageCountForSkill(skillName) {
    return entriesForSkill(skillName).length;
}
