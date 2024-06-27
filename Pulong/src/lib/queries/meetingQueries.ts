import prisma from '$lib/server/prisma';
import type { TeamMeeting } from '@prisma/client';

export const createMeeting = async (data: any) => {
	const meeting = await prisma.teamMeeting.create({
		data: data
	});
	return meeting;
};
export const getUserInAttendaceByMeetingId = async (userId: string) => {
	let team = await prisma.teamMeetingAttendance.findFirst({
		where: {
			userId: userId
		},
		select: {
			id: true,
			role: true
		}
	});
	return team;
};
export const getAttendanceByMeetingId = async (meetingId: string) => {
	let team = await prisma.teamMeetingAttendance.findMany({
		where: {
			meetingId: meetingId
		},
		select: {
			id: true,
			role: true,
			userId: true
		}
	});
	return team;
};
export const getTeamMeetingByTeamIds = async (teamIds: string[]) => {
	let team = await prisma.teamMeeting.findMany({
		where: {
			teamId: {
				in: teamIds
			}
		},
		select: {
			id: true,
			isStarted: true,
			teamId: true,
			team: {
				select: {
					id: true,
					name: true,
					agenda: {
						select: {
							id: true,
							name: true,
							minutes: true,
							done: true
						}
					}
				}
			},
			teamMeetingAttendance: {
				select: {
					isJoined: true,
					joinedAt: true,
					user: {
						select: {
							id: true,
							name: true
						}
					}
				}
			}
		}
	});
	return team;
};

export const getTeamMeetingById = async (meetingId: string) => {
	let team = await prisma.teamMeeting.findFirst({
		where: {
			id: meetingId
		},
		select: {
			id: true,
			isStarted: true,
			startAt: true,
			teamId: true,
			team: {
				select: {
					id: true,
					name: true,
					agenda: {
						select: {
							id: true,
							name: true,
							minutes: true,
							done: true
						}
					}
				}
			},
			teamMeetingAttendance: {
				select: {
					isJoined: true,
					joinedAt: true,
					role: true,
					user: {
						select: {
							id: true,
							name: true
						}
					}
				}
			}
		}
	});
	return team;
};
export const getTeamMeetingTeamId = async (teamIds: string) => {
	let team = await prisma.teamMeeting.findFirst({
		where: {
			teamId: teamIds
		},
		select: {
			id: true,
			isStarted: true
		}
	});
	return team;
};

export const getCurrentMeeting = async (teamIds: string) => {
	let team = await prisma.teamMeeting.findFirst({
		where: {
			AND: [{ teamId: teamIds }, { isCurrent: true }]
		},
		select: {
			id: true,
			isStarted: true,
			isCurrent: true,
			startAt: true,
			teamId: true,
			team: {
				select: {
					id: true,
					name: true,
					agenda: {
						select: {
							id: true,
							name: true,
							minutes: true,
							done: true
						}
					}
				}
			},
			teamMeetingAttendance: {
				select: {
					isJoined: true,
					joinedAt: true,
					role: true,
					user: {
						select: {
							id: true,
							name: true
						}
					}
				}
			}
		}
	});
	return team;
};
export const getTeamMeeting = async (teamIds: string) => {
	let team = await prisma.teamMeeting.findFirst({
		where: {
			teamId: teamIds
		},
		select: {
			id: true,
			isStarted: true
		}
	});
	return team;
};
export const getAllTeamAttendanceByUserId = async (userId: string) => {
	let team = await prisma.teamMeetingAttendance.findMany({
		where: {
			userId: userId
		},
		select: {
			id: true,
			role: true,
			isJoined: true,
			meetingId: true
		}
	});
	return team;
};

export const getTeamAttendanceByUserId = async (userId: string, meetingId: string) => {
	let team = await prisma.teamMeetingAttendance.findFirst({
		where: {
			AND: [{ userId: userId }, { meetingId: meetingId }]
		},
		select: {
			id: true,
			role: true
		}
	});
	return team;
};

export const getAttendanceInfo = async (userId: string, meetingId: string) => {
	let attendance = await prisma.teamMeetingAttendance.findFirst({
		where: {
			AND: [{ userId: userId }, { meetingId: meetingId }]
		},
		select: {
			id: true,
			role: true,
			isJoined: true
		}
	});
	return attendance;
};
export const checkAttendanceRole = async (role: string, meetingId: string) => {
	let scribe = await prisma.teamMeetingAttendance.findFirst({
		where: {
			AND: [{ role: role }, { meetingId: meetingId }]
		},
		select: {
			id: true,
			role: true
		}
	});
	if (scribe) {
		return true;
	} else {
		return false;
	}
};

export const checkTeamMember = async (userId: string, teamId: string) => {
	let isTeam = false;
	let owner = await prisma.team.findFirst({
		where: {
			AND: [{ ownerId: userId }, { id: teamId }]
		},
		select: {
			id: true
		}
	});
	if (owner) isTeam = true;

	let team = await prisma.teamMember.findFirst({
		where: {
			AND: [{ userId: userId }, { teamId: teamId }]
		},
		select: {
			id: true
		}
	});

	if (team) isTeam = true;

	return isTeam;
};
