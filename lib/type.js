//@ts-check
/**
 * @typedef {Object} Listen
 * @property {string} inserted_at full date string
 * @property {number} listened_at timestamp
 * @property {string} recording_msid
 * @property {TrackMetadata} track_metadata
 * @property {string} user_name
 */
/**
 * @typedef {Object} TrackMetadata
 * @property {Record<string, string>} additional_info
 * @property {Record<string, string>} mbid_mapping
 * @property {string} artist_name
 * @property {string} track_name
 * @property {string} release_name
 */
export {};
