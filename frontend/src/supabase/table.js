
import { supabase } from '../supabase/supabase-client';

export class ReportService {
    async createReport(reportData) {

        const { error } = await supabase
            .from('reports')
            .insert(reportData)
            .single();

        if (error) {
            return ({ status: 'error', msg: error });
        } else {
            return ({ status: 'success', msg: 'Report submitted successfully!' });
        }
    }

    async getAllOfficers() {
        const { data, error } = await supabase
            .from('officers')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            return ({ status: 'error', msg: error });
        } else {
            return ({ status: 'success', data: data });
        }
    }

    async getAllReports() {
        const { data, error } = await supabase
            .from('reports')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            return ({ status: 'error', msg: error });
        } else {
            return ({ status: 'success', data: data });
        }
    }

    async getReportsByState(state) {
        const { data, error } = await supabase
            .from('reports')
            .select('*')
            .eq('state', state)
            .order('created_at', { ascending: false });

        if (error) {
            return ({ status: 'error', msg: error });
        } else {
            return ({ status: 'success', data: data });
        }
    }

    async getReportsByStateCity(state, city) {
        const { data, error } = await supabase
            .from('reports')
            .select('*')
            .eq('state', state)
            .eq('city', city)
            .order('created_at', { ascending: false });

        if (error) {
            return ({ status: 'error', msg: error });
        } else {
            return ({ status: 'success', data: data });
        }
    }

    async getReportById(reportId) {
        const { data, error } = await supabase
            .from('reports')
            .select('*')
            .eq('id', reportId)
            .single();

        if (error) {
            return ({ status: 'error', msg: error });
        } else {
            return ({ status: 'success', data: data });
        }
    }

    async getReportsByUserIdName(userId, name) {
        const { data, error } = await supabase
            .from('reports')
            .select('*')
            .eq('createdById', userId)
            .eq('createdByName', name);

        if (error) {
            return ({ status: 'error', msg: error });
        } else {
            return ({ status: 'success', data: data });
        }
    }

    async getReportsByAssignedTo(officerId) {
        const { data, error } = await supabase
            .from('reports')
            .select('*')
            .eq('assignedToId', officerId);

        if (error) {
            return ({ status: 'error', msg: error });
        } else {
            return ({ status: 'success', data: data });
        }
    }

    async deleteReport(reportId) {
        const { error } = await supabase
            .from('reports')
            .delete()
            .eq('id', reportId);

        if (error) {
            return ({ status: 'error', msg: error });
        } else {
            return ({ status: 'success', msg: 'Report deleted successfully!' });
        }
    }

    async assignOfficerToReport(reportId, officerId, officerName, officerNumber) {

        const { data, error } = await supabase
            .from('reports')
            .update({ status: 'In Progress', assignedToId: officerId, assignedToName: officerName, assignedToPhone: officerNumber })
            .eq('id', reportId);

        if (error) {
            return ({ status: 'error', msg: error });
        } else {
            return ({ status: 'success', data: data, msg: 'Report updated successfully!' });
        }
    }

    async getOfficerByAuthId(authId) {
        const { data, error } = await supabase
            .from('officers')
            .select('*')
            .eq('auth_id', authId)
            .single();

        if (error) {
            return ({ status: 'error', msg: error });
        } else {
            return ({ status: 'success', data: data });
        }
    }

    async assignOfficerToTable(officerId, reportId) {

        const { data, error } = await supabase
            .from('officers')
            .update({ assign_id: reportId, workDoneStatus: 'In Progress' })
            .eq('id', officerId);

        if (error) {
            return ({ status: 'error', msg: error });
        } else {
            return ({ status: 'success', data: data, msg: 'Report updated successfully!' });
        }
    }

    async makeOfficerFree(officerId) {

        const { data, error } = await supabase
            .from('officers')
            .update({ assign_id: '', workDoneStatus: 'Not Assigned' })
            .eq('id', officerId);

        if (error) {
            return ({ status: 'make officer free: ', msg: error });
        } else {
            return ({ status: 'success', data: data, msg: 'Report updated successfully!' });
        }
    }

    async officerWorkDoneUpdate(officerId) {

        const { data, error } = await supabase
            .from('officers')
            .update({ assign_id: '', workDoneStatus: 'Not Assigned' })
            .eq('id', officerId);

        if (error) {
            return ({ status: 'error', msg: error });
        } else {
            return ({ status: 'success', data: data, msg: 'Report updated successfully!' });
        }
    }

    async userFeedback(reportId, feedbackData) {

        if (feedbackData === 'sad') {
            // set report Pending again
            const { data, error } = await supabase
                .from('reports')
                .update({ status: 'Pending', assignedToId: null, assignedToName: null, assignedToPhone: null, user_feedback: feedbackData })
                .eq('id', reportId);

            if (error) {
                return ({ status: 'error', msg: error });
            } else {
                return ({ status: 'success', data: data, msg: 'Report updated successfully!' });
            }
        }

        const { data, error } = await supabase
            .from('reports')
            .update({ user_feedback: feedbackData })
            .eq('id', reportId);

        if (error) {
            return ({ status: 'error', msg: error });
        } else {
            return ({ status: 'success', data: data, msg: 'Report updated successfully!' });
        }
    }

    async updateReport(reportId, updateData) {

        const { data, error } = await supabase
            .from('reports')
            .update(updateData)
            .eq('id', reportId);

        if (error) {
            return ({ status: 'error', msg: error });
        } else {
            return ({ status: 'success', data: data, msg: 'Report updated successfully!' });
        }
    }
}

const reportService = new ReportService();

export default reportService;