from enum import Enum


class SkillLevel(str, Enum):
    complete_beginner = "complete_beginner"
    know_basics = "know_basics"
    intermediate = "intermediate"
    advanced = "advanced"


class LearningGoal(str, Enum):
    career = "career"           # A — Career & Professional Growth
    hobby = "hobby"             # B — Personal Hobby & Fun
    academics = "academics"     # C — School & Academics
    curious = "curious"         # D — Just Curious


class InstructorTone(str, Enum):
    fun_energetic = "fun_energetic"           # A — Fun & Energetic
    professional_direct = "professional_direct"  # B — Professional & Direct
    coach = "coach"                           # C — Challenging & Coach-like
    relaxed = "relaxed"                       # D — Relaxed & Encouraging


class DailyCommitment(str, Enum):
    five_min = "5_minutes"
    ten_fifteen_min = "10_15_minutes"
    thirty_plus_min = "30_plus_minutes"
    own_pace = "own_pace"
