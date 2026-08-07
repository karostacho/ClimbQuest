"""add check constraint on routes.grade_index

Revision ID: 0002
Revises: 0001
Create Date: 2026-08-05
"""
from alembic import op

revision = "0002"
down_revision = "0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_check_constraint(
        "ck_routes_grade_index_range",
        "routes",
        "grade_index >= 1 AND grade_index <= 77",
    )


def downgrade() -> None:
    op.drop_constraint("ck_routes_grade_index_range", "routes", type_="check")
