| table_from                         | column_from     | table_to                     | column_to   | definition                                                                                      |
| ---------------------------------- | --------------- | ---------------------------- | ----------- | ----------------------------------------------------------------------------------------------- |
| storage.objects                    | bucket_id       | storage.buckets              | id          | FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id)                                          |
| auth.identities                    | user_id         | auth.users                   | id          | FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE                               |
| auth.sessions                      | user_id         | auth.users                   | id          | FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE                               |
| auth.refresh_tokens                | session_id      | auth.sessions                | id          | FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE                         |
| auth.mfa_factors                   | user_id         | auth.users                   | id          | FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE                               |
| auth.mfa_challenges                | factor_id       | auth.mfa_factors             | id          | FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE                       |
| auth.mfa_amr_claims                | session_id      | auth.sessions                | id          | FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE                         |
| auth.sso_domains                   | sso_provider_id | auth.sso_providers           | id          | FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE               |
| auth.saml_providers                | sso_provider_id | auth.sso_providers           | id          | FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE               |
| auth.saml_relay_states             | sso_provider_id | auth.sso_providers           | id          | FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE               |
| auth.saml_relay_states             | flow_state_id   | auth.flow_state              | id          | FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE                    |
| auth.one_time_tokens               | user_id         | auth.users                   | id          | FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE                               |
| auth.oauth_consents                | user_id         | auth.users                   | id          | FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE                               |
| auth.oauth_consents                | client_id       | auth.oauth_clients           | id          | FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE                     |
| auth.sessions                      | oauth_client_id | auth.oauth_clients           | id          | FOREIGN KEY (oauth_client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE               |
| storage.s3_multipart_uploads       | bucket_id       | storage.buckets              | id          | FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id)                                          |
| storage.s3_multipart_uploads_parts | upload_id       | storage.s3_multipart_uploads | id          | FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE           |
| auth.oauth_authorizations          | client_id       | auth.oauth_clients           | id          | FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE                     |
| auth.oauth_authorizations          | user_id         | auth.users                   | id          | FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE                               |
| storage.s3_multipart_uploads_parts | bucket_id       | storage.buckets              | id          | FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id)                                          |
| storage.prefixes                   | bucket_id       | storage.buckets              | id          | FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id)                                          |
| claims                             | claimant_id     | claimants                    | claimant_id | FOREIGN KEY (claimant_id) REFERENCES claimants(claimant_id) ON UPDATE CASCADE ON DELETE CASCADE |
| documents                          | claim_id        | claims                       | claim_id    | FOREIGN KEY (claim_id) REFERENCES claims(claim_id) ON UPDATE CASCADE ON DELETE CASCADE          |
| topology.layer                     | topology_id     | topology.topology            | id          | FOREIGN KEY (topology_id) REFERENCES topology.topology(id)                                      |
| verifications                      | claim_id        | claims                       | claim_id    | FOREIGN KEY (claim_id) REFERENCES claims(claim_id) ON DELETE CASCADE                            |
| dss_recommendations                | claim_id        | claims                       | claim_id    | FOREIGN KEY (claim_id) REFERENCES claims(claim_id) ON DELETE CASCADE                            |
| storage.vector_indexes             | bucket_id       | storage.buckets_vectors      | id          | FOREIGN KEY (bucket_id) REFERENCES storage.buckets_vectors(id)                                  |
| family_members                     | claim_id        | claims                       | claim_id    | FOREIGN KEY (claim_id) REFERENCES claims(claim_id) ON DELETE CASCADE                            |

| table_name          | column_name               | data_type                   | is_nullable | column_default                            |
| ------------------- | ------------------------- | --------------------------- | ----------- | ----------------------------------------- |
| claimants           | claimant_id               | uuid                        | NO          | gen_random_uuid()                         |
| claimants           | claimant_name             | text                        | NO          | null                                      |
| claimants           | village                   | text                        | YES         | null                                      |
| claimants           | district                  | text                        | YES         | null                                      |
| claimants           | phone_number              | text                        | NO          | null                                      |
| claimants           | state                     | text                        | YES         | null                                      |
| claimants           | tehsil                    | text                        | YES         | null                                      |
| claimants           | created_at                | timestamp with time zone    | YES         | (now() AT TIME ZONE 'Asia/Kolkata'::text) |
| claimants           | father_name               | text                        | YES         | null                                      |
| claimants           | gender                    | text                        | YES         | null                                      |
| claimants           | date_of_birth             | date                        | YES         | null                                      |
| claimants           | is_scheduled_tribe        | boolean                     | YES         | null                                      |
| claimants           | age                       | integer                     | YES         | null                                      |
| claimants           | gram_panchayat            | text                        | YES         | null                                      |
| claimants           | block                     | text                        | YES         | null                                      |
| claimants           | pin_code                  | text                        | YES         | null                                      |
| claimants           | family_size               | integer                     | YES         | null                                      |
| claimants           | annual_income             | integer                     | YES         | null                                      |
| claimants           | belongs_to_pvtg           | boolean                     | YES         | false                                     |
| claimants           | tribe_name                | text                        | YES         | null                                      |
| claimants           | aadhaar                   | text                        | YES         | null                                      |
| claims              | claim_id                  | uuid                        | NO          | gen_random_uuid()                         |
| claims              | claimant_id               | uuid                        | NO          | null                                      |
| claims              | status                    | text                        | YES         | null                                      |
| claims              | claim_polygon             | USER-DEFINED                | YES         | null                                      |
| claims              | submitted_at              | timestamp with time zone    | YES         | (now() AT TIME ZONE 'Asia/Kolkata'::text) |
| claims              | public_claim_id           | text                        | YES         | null                                      |
| claims              | gram_panchayat            | text                        | YES         | null                                      |
| claims              | tehsil                    | text                        | YES         | null                                      |
| claims              | land_area_hectares        | numeric                     | YES         | null                                      |
| claims              | land_location_description | text                        | YES         | null                                      |
| claims              | claim_type                | text                        | YES         | null                                      |
| claims              | priority_score            | numeric                     | YES         | null                                      |
| claims              | processed_at              | timestamp with time zone    | YES         | null                                      |
| claims              | approved_at               | timestamp with time zone    | YES         | null                                      |
| claims              | rejection_reason          | text                        | YES         | null                                      |
| claims              | updated_at                | timestamp with time zone    | YES         | now()                                     |
| documents           | document_id               | uuid                        | NO          | gen_random_uuid()                         |
| documents           | claim_id                  | uuid                        | NO          | null                                      |
| documents           | storage_path              | text                        | NO          | null                                      |
| documents           | ocr_text                  | text                        | YES         | null                                      |
| documents           | ner_data                  | jsonb                       | YES         | null                                      |
| documents           | created_at                | timestamp with time zone    | YES         | now()                                     |
| documents           | document_type             | text                        | YES         | null                                      |
| documents           | health_score              | integer                     | YES         | null                                      |
| documents           | validation_results        | jsonb                       | YES         | null                                      |
| documents           | file_path                 | text                        | YES         | null                                      |
| documents           | file_name                 | text                        | YES         | null                                      |
| documents           | file_size                 | integer                     | YES         | null                                      |
| documents           | mime_type                 | text                        | YES         | null                                      |
| documents           | document_category         | text                        | YES         | null                                      |
| dss_recommendations | id                        | uuid                        | NO          | uuid_generate_v4()                        |
| dss_recommendations | claim_id                  | uuid                        | NO          | null                                      |
| dss_recommendations | scheme_name               | text                        | NO          | null                                      |
| dss_recommendations | reasoning                 | text                        | YES         | null                                      |
| dss_recommendations | priority                  | text                        | YES         | null                                      |
| dss_recommendations | generated_at              | timestamp without time zone | YES         | now()                                     |
| dss_recommendations | department                | text                        | YES         | null                                      |
| dss_recommendations | eligibility_score         | numeric                     | YES         | null                                      |
| dss_recommendations | recommendation_reason     | text                        | YES         | null                                      |
| family_members      | id                        | uuid                        | NO          | gen_random_uuid()                         |
| family_members      | claim_id                  | uuid                        | NO          | null                                      |
| family_members      | name                      | text                        | NO          | null                                      |
| family_members      | relation                  | text                        | NO          | null                                      |
| family_members      | age                       | integer                     | YES         | null                                      |
| family_members      | gender                    | text                        | YES         | null                                      |
| family_members      | created_at                | timestamp with time zone    | YES         | now()                                     |
| verifications       | id                        | uuid                        | NO          | uuid_generate_v4()                        |
| verifications       | claim_id                  | uuid                        | NO          | null                                      |
| verifications       | committee_type            | text                        | YES         | null                                      |
| verifications       | verification_date         | date                        | YES         | null                                      |
| verifications       | recommendation            | text                        | YES         | null                                      |
| verifications       | official_notes            | text                        | YES         | null                                      |
| verifications       | created_at                | timestamp with time zone    | YES         | now()                                     |
| verifications       | verification_stage        | text                        | YES         | null                                      |
| verifications       | verified_by               | text                        | YES         | null                                      |
| verifications       | verification_result       | text                        | YES         | null                                      |
| verifications       | comments                  | text                        | YES         | null                                      |