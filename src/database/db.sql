create TABLE bosssubscriptions(
    channel_id VARCHAR(255) unique,
    offsets integer[]
);