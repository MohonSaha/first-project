import { TSchedule } from './offeredCourse.interface'

export const hasTimeConflict = (
  assignedSchedules: TSchedule[],
  newSchedule: TSchedule,
) => {
  for (const Schedule of assignedSchedules) {
    const existingStartTime = new Date(`1970-01-01T${Schedule.startTime}`)
    const existingEndTime = new Date(`1970-01-01T${Schedule.endTime}`)

    const newStartTime = new Date(`1970-01-01T${newSchedule.startTime}`)
    const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}`)

    if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
      return true
    }
  }

  return false
}
