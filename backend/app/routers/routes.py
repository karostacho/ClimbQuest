from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import asc, desc, select
from sqlalchemy.orm import Session

from app.deps import get_current_user, get_db
from app.models import Route, User
from app.schemas import RouteCreate, RouteOut

router = APIRouter(prefix="/api/routes", tags=["routes"])

SORTABLE_COLUMNS = {"date": Route.climb_date, "grade": Route.grade_index}


@router.get("", response_model=list[RouteOut])
def list_routes(
    sort_by: Literal["date", "grade"] = "date",
    order: Literal["asc", "desc"] = "desc",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[Route]:
    column = SORTABLE_COLUMNS[sort_by]
    direction = asc if order == "asc" else desc
    stmt = (
        select(Route)
        .where(Route.user_id == current_user.id)
        .order_by(direction(column), desc(Route.grade_index), asc(Route.route_name))
    )
    return list(db.scalars(stmt))


@router.post("", response_model=RouteOut, status_code=status.HTTP_201_CREATED)
def create_route(
    payload: RouteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Route:
    route = Route(user_id=current_user.id, **payload.model_dump())
    db.add(route)
    db.commit()
    db.refresh(route)
    return route


@router.delete("/{route_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_route(
    route_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    route = db.get(Route, route_id)
    if route is None or route.user_id != current_user.id:
        # Same 404 whether the route doesn't exist or belongs to someone else,
        # so a caller can't use this to enumerate other users' route ids.
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Route not found")

    db.delete(route)
    db.commit()
