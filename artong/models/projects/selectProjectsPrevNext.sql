SELECT * FROM (
    (SELECT
    create_tx_hash,
    project_s3key,
    project_thumbnail_s3key,
    background_s3key,
    background_thumbnail_s3key,
    member_id,
    address,
    name,
    symbol,
    status,
    created_at,
    updated_at
    FROM
        projects
    WHERE 1=1
        AND status = 'CREATED'
        AND created_at > (SELECT created_at FROM projects WHERE address = ${address})
    ORDER BY created_at ASC
    LIMIT ${prev_next_count})

    UNION ALL

    (SELECT
        create_tx_hash,
        project_s3key,
        project_thumbnail_s3key,
        background_s3key,
        background_thumbnail_s3key,
        member_id,
        address,
        name,
        symbol,
        status,
        created_at,
        updated_at
    FROM
        projects
    WHERE 1=1
        AND status = 'CREATED'
        AND created_at < (SELECT created_at FROM projects WHERE address = ${address})
    ORDER BY created_at DESC
    LIMIT ${prev_next_count})
) AS sub
ORDER BY created_at ASC