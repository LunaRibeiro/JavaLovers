
ALTER TABLE item_donated
    ADD COLUMN item_donated_id BIGINT NOT NULL;


ALTER TABLE item_donated
    ADD CONSTRAINT pk_item_donated PRIMARY KEY (item_donated_id);

ALTER TABLE item_donated
    ADD CONSTRAINT uk_item_donated UNIQUE (donation_id, item_id);


ALTER TABLE item_withdrawn
    ADD COLUMN item_withdrawn_id  BIGINT NOT NULL ;


ALTER TABLE item_withdrawn
    ADD CONSTRAINT pk_item_withdrawn PRIMARY KEY (item_withdrawn_id);

ALTER TABLE item_withdrawn
    ADD CONSTRAINT uk_item_withdrawn UNIQUE (withdrawal_id, item_id);
