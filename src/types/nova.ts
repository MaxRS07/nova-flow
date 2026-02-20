/**
 * Nova Flow API Types
 * Types for browser automation, interactions, and file operations
 */

/**
 * Common request/response types
 */


export type ActMetadata = {
    session_id: string;
    act_id: string;
    num_steps_executed: number;
    start_time: number | null;
    end_time: number | null;
    prompt: string;
    step_server_times_s: number[];
    time_worked_s: number | null;
    human_wait_time_s: number;
}